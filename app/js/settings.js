/*
* Responsible for managing the app settings.
* */
var settings = {
	'folder':'./',
	'port': 3000,
	'token-length': 32,
	'default-agent-id': 'exhesham.com'
}

module.exports.getPort = function () {
	return settings['port'];
}
module.exports.getTokenLength = function () {
	return settings['token-length'];
}

module.exports.getAgentID = function () {
	try {
		var network = new ActiveXObject('WScript.Network');
		// Show a pop up if it works
		return network.computerName;
	}
	catch (e) {
		return settings['default-agent-id'];
	}
}