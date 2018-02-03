// index.js -> bundle.js
var QRCode = require('qrcode')
var utils = require('utils')
function generate() {
	var token = utils.generateToken();
	var canvas = document.getElementById('qrcodec')
	QRCode.toCanvas(canvas, token, function (error) {
		if (error) console.error(error)
		console.log('success!');
	});
}

generate();
exports.generateQR = generate;
