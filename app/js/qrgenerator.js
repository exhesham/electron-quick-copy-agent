// index.js -> bundle.js
const QRCode = require('qrcode');
const path = require('path');
const database = require( path.resolve( __dirname, "database.js" ));
const utils = require( path.resolve( __dirname,"utils.js" ) );

function generate() {
	var token = utils.generateQR();
	var canvas = document.getElementById('qrcodec');
	if(!canvas){
		console.error('canvas is not initialized yet!!');
		return;
	}

	QRCode.toCanvas(canvas, token, function (error) {
		if (error) console.error(error);
		// store the qrcode for generated qr codes table
		new database.Database('qrs').storeRecord(generateRecordForDB(token));
		console.log('success!');
	});
}
function generateRecordForDB(token){
	return {token: token};
}

/**
 *
 * @param qrcode
 * @returns {Promise}
 */
function validateQR(qrcode) {
	console.debug('validateQR: '+ qrcode)
	return new database.Database('qrs').findRecord('token', qrcode);
}
exports.generate = generate;
exports.validateQR = validateQR;