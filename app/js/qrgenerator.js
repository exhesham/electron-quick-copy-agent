// index.js -> bundle.js
var QRCode = require('qrcode');
var path = require('path');
var utils = require( path.resolve( __dirname,"js", "utils.js" ) );
function generate() {
	var token = utils.generateToken();
	var canvas = document.getElementById('qrcodec')
	QRCode.toCanvas(canvas, token, function (error) {
		if (error) console.error(error)
		console.log('success!');
	});
}

generate();
