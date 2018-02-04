/*
* Responsible for managing the app settings.
* */
var settings = {
	'protocol':'https://',
	'folder':'./',
	'version':'v1.8.2.1',   // 1.8 is the year 2 is the month and 1 is the serial num
	'port': 3000,
	'token-length': 32,
	'database-dir': './',
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
module.exports.databaseDir = function () {
	return settings['database-dir'];
}
module.exports.getProtocol = function() {
	return settings['protocol'];
}
module.exports.getVersion = function() {
	return settings['version'];
}