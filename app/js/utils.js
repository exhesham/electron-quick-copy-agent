/***
 * Generate a metadata record for the file. this record according to the diagram will be saved at
 * user metadata->history->files[]
 * @param filename the recieved file name
 * @param receivedAsFolder if the file is part of a folder that the user sent
 * @param user the record of the user. this json contains the settings metadata
 * @returns {{filename: *, originalName: string, originalFullName: string, distName: string, receivedAsFolder: *, date: string}}
 */
var path = require('path');
var myip = require('quick-local-ip');
var os = require('os');
var settings = require( path.resolve( __dirname, "settings.js" ) );
function getMetadataForFile(filename, receivedAsFolder, user){
	//TODO:Take the settings from the user and check if can create file with this name
	return{	filename:filename,
			originalName:'',
			originalFullName:'',
			distName:'',
			receivedAsFolder:receivedAsFolder,
			date: ''
	};
}

function randomStriing(len) {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < len; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

function Base64Encode(str) {
	var encoding = 'utf-8'
	var bytes = new (TextEncoder || TextEncoderLite)(encoding).encode(str);
	return base64js.fromByteArray(bytes);
}

function Base64Decode(str) {
	var encoding = 'utf-8'
	var bytes = base64js.toByteArray(str);
	return new (TextDecoder || TextDecoderLite)(encoding).decode(bytes);
}
/**
 * will generate a token with the data: port@32 letters hash
 * for example: 3000@
 */
function generateToken() {
	return settings.getProtocol() +getIP() + ':' + settings.getPort() + '@' + randomStriing(settings.getTokenLength())
}

function getIP() {
	return myip.getLocalIP4();
}
exports.getMetadataForFile = getMetadataForFile;
exports.generateToken = generateToken;
exports.Base64Decode = Base64Decode;
exports.Base64Encode = Base64Encode;
exports.getIP = getIP;
