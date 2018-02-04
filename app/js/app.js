const express = require('express');
var busboy = require('connect-busboy'); //middleware for form/file upload
var path = require('path');     //used for file path
var fs = require('fs-extra');       //File System - for file manipulation
var utils = require('utils');
var settings = require('settings');
const app = express()
app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
	res.send('Hello World!')
});

/***
 * the scanned QRCode will be sent to this call
 * @username
 * @qrcode
 */
app.post('/authorize/qrcode', function (req, res) {
	var qrcode= req.param('qrcode');
	var username = req.param('username');
	if(!username || !utils.isQrCodeCorrect(qrcode)){
		res.send({status: 'fail', msg:'qr code is not correct or empty username!'});
	}else{
		var token = UsersAgent().storeTokenForUser(username, qrcode);
		/*
		the scanned token by the user will not be the same as the returned one as the captured one may be stolen or captured by a second party
		so in order for it not to be used by the attacker as impersonation, another random one will be created and posted back to the user.
		 */
		res.send({status: 'success', token:token, agent:settings.getAgentID()});
	}
});
/***
 * Expecting params:
 * @text: the text to save.
 * @token
 */
app.post('/transfer/text', function (req, res) {
	// get the user token
	var token = req.param('token');
	// get instance for the user
	var user = UsersAgent().getUserByToken(token);
	if (!user) {
		res.redirect({status: 'fail', msg: 'file not found'});
		return;
	}
	var text = req.param('text');
	var metadata = utils.getMetadataForText(text, user);
	user.commitTransferredText(metadata);
	res.send({status: 'success'})
});

/**
 * Expecting params:
 * @file
 * @token
 */
app.post('/transfer/file', function (req, res) {
	// get the user token
	var token = req.param('token');
	// get instance for the user
	var user = UsersAgent().getUserByToken(token);
	if (!user) {
		res.redirect({status: 'fail', msg: 'file not found'});
		return;
	}
	var fstream;
	req.pipe(req.busboy);
	// start streaming
	req.busboy.on('file', function (fieldname, file, filename) {
		console.log("Uploading: " + filename);
		var metadata = utils.getMetadataForFile(filename, false, user);
		//Path where image will be uploaded
		fstream = fs.createWriteStream(metadata.filename);
		file.pipe(fstream);
		fstream.on('close', function () {
			console.log("Upload Finished of " + filename);
			// save metadata for the user...
			user.commitFileTransferred(metadata);
			res.redirect('back');           //where to go next
		});
	});
});

app.listen(settings.getPort(), '0.0.0.0');