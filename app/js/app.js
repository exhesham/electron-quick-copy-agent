const express = require('express');
var busboy = require('connect-busboy'); //middleware for form/file upload
var path = require('path');     //used for file path
var fs = require('fs-extra');       //File System - for file manipulation
var utils = require('utils');
const app = express()
app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
	res.send('Hello World!')
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

app.listen(3000, '0.0.0.0');