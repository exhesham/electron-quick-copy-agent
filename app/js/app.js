const express = require('express');
const bodyParser = require('body-parser');
var busboy = require('connect-busboy'); //middleware for form/file upload
var path = require('path');     //used for file path
var fs = require('fs-extra');       //File System - for file manipulation

var relativePath = path.resolve( __dirname, "js" );
if(!fs.existsSync(relativePath)) relativePath = __dirname
var qr = require( path.resolve( relativePath, "qrgenerator.js" ) );
var utils = require( path.resolve( relativePath, "utils.js" ) );
var settings = require( path.resolve( relativePath, "settings.js" ) );
var user = require( path.resolve( relativePath, "user.js" ) );
var uiText = require( path.resolve( relativePath, "ui-messages.js" ) );
const app = express();
app.use(bodyParser.json());
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
	console.debug('validating qrcode');
	res.setHeader('Content-Type', 'application/json');
	const err = {status: 'fail', error:'qr code is not correct or empty username!'};
	var qrcode= req.body['qrcode'];
	var username = req.body['username'];

	console.debug('received qrcode='+qrcode +' and username='+username);
	if(!username){
		console.error('validating qrcode: no username ');
		res.status(400).json(err);
	}
	qr.validateQR(qrcode).then(function (value) {
		var token = user.UsersAgent().storeTokenForUser(username, qrcode);
		/*
		the scanned token by the user will not be the same as the returned one as the captured one may be stolen or captured by a second party
		so in order for it not to be used by the attacker as impersonation, another random one will be created and posted back to the user.
		 */
		var address = utils.getAddress();
		res.send(200, {'mobile-token':token,'address':address, 'agent':settings.getAgentID()});
	}).catch(function (reason) {
		console.error('validating qrcode: qrcode that was received is not correct');
		res.send(400, err);
	})
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
	var sender = user.UsersAgent().getUserByToken(token);
	if (!sender) {
		console.error('failed to receive the text because the token is not valid:' + token);
		res.redirect({status: 'fail', msg: 'file not found'});
		return;
	}
	var text = req.param('text');
	console.debug('received the msg from the user');
	res.json({status: 'success'});

	// generate the matadata that combine the sender mobile and text
	var metadata = utils.getMetadataForText(text, sender);
	uiText.addNewMessageDomToUI(metadata);
	sender.commitTransferredText(metadata);
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
module.exports = app;