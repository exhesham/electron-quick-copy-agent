/*
* Responsible for managing the database settings.
* */
var fs = require("fs");
const path = require('path');
var utils = require( path.resolve( __dirname, "utils.js" ) );
var settings = require( path.resolve( __dirname,"settings.js" ) );
var readLine = require('readline');
function Database(dbName){
	// initialize

	this.dbName = dbName;
	var filename = databaseNameToFilename(this.dbName);
	if (!fs.existsSync(filename)) {
		// create the container
		console.debug('creating database file: '+ filename)
		try{
			fs.openSync(filename,'w+');
		}catch (e){
			console.error("Cannot write file ", e);
		}
		console.debug('done creating database file: '+ filename)
	}
	function databaseNameToFilename(dbname) {
		return path.join(settings.databaseDir(),'__' + dbname + '.agent.db');
	}

	this.storeRecord = function(newRecord){

		var filename = databaseNameToFilename(this.dbName);
		console.debug('storeRecord: database file: '+ filename)
		fs.appendFileSync(filename,JSON.stringify(newRecord)+'\n');
	}
	/**
	 * this is an async method that will go over the lines in the file and try to parse them as json. if succeeded
	 * it will look for the key and the value
	 * @param key
	 * @param val
	 * @param cb callback that will be called after finding the line - the cb will receive the json as parameter
	 */
	this.findRecord = function(key,val){
		console.debug('called findRecord');
		return new Promise(function(resolve, reject) {
			if(!val || !key){
				console.error('findRecord: one of the input params is undefined.')
				reject('findRecord: one of the input params is undefined.');
				return;
			}
			var lineReader = readLine.createInterface({
				input: fs.createReadStream(filename)
			});

			lineReader.on('line', function (line) {
				try{
					var json = JSON.parse(line);
					if(json[key] == val){
						resolve(json)
					}
				}catch (e){
					console.log('failed to parse json by looking for the key ' + key + ' at file ' + filename);
					reject('failed to parse json by looking for the key');
				}
			});
		});

	}
}

function getUserDBName(name) {
	return 'user_' + utils.Base64Encode(name).replace(/=/g,'');
}

exports.Database = Database;
exports.getUserDBName = getUserDBName;