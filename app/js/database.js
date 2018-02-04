/*
* Responsible for managing the database settings.
* */
var fs = require("fs");
var utils = require("utils");
var settings = require('settings');
var readLine = require('readline');
function Database(dbName){
	// initialize

	this.dbName = dbName;
	this.db = openDatabase(dbName);
	function databaseNameToFilename(dbname) {
		return path.join(settings.databaseDir(),'__' + dbname + '.agent.db');
	}

	this.storeRecord = function(newRecord){
		var filename = databaseNameToFilename(dbName);
		fs.appendFileSync(filename,JSON.stringify(newRecord));
	}
	/**
	 * this is an async method that will go over the lines in the file and try to parse them as json. if succeeded
	 * it will look for the key and the value
	 * @param key
	 * @param val
	 * @param cb callback that will be called after finding the line - the cb will receive the json as parameter
	 */
	this.findRecord = function(key,val, cb){
		if(!cb || !val || !key){
			console.error('findRecord: one of the input params is undefined.')
			return;
		}
		var lineReader = readLine.createInterface({
			input: fs.createReadStream(databaseNameToFilename(this.dbName))
		});

		lineReader.on('line', function (line) {
			try{
				var json = JSON.parse(line);
				if(json[key] == val){
					cb(json)
				}
			}catch (e){
				console.log('failed to parse json by looking for the key ' + key + ' at file ' + filename);
			}
		});
	}
}

function getUserDBName(name) {
	return 'user_' + utils.Base64Encode(name).replace('=','');
}