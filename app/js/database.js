/*
* Responsible for managing the database settings.
* */
var fs = require("fs");
const path = require('path');
var utils = require( path.resolve( __dirname, "utils.js" ) );
var settings = require( path.resolve( __dirname,"settings.js" ) );
var readLine = require('readline');
function Database(dbName){
	function databaseNameToFilename(dbname) {
		return path.join(settings.databaseDir(),'__' + dbname + '.agent.db');
	}
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

	this.getRecords = function(){

		return new Promise(function(resolve, reject) {
			var res = [];
			var lineReader = readLine.createInterface({
				input: fs.createReadStream(filename)
			});

			lineReader.on('line', function (line) {
				try{
					var json = JSON.parse(line);
					res.push(json)
				}catch (e){
					console.log('failed to parse json by looking for the key ' + key + ' at file ' + filename);
					reject('failed to parse json by looking for the key');
					return;
				}
			});
			lineReader.on('close', function(){
				resolve(res);
			});

		});

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

function getUsersDBName() {
	// return 'user_' + utils.Base64Encode(name).replace(/=/g,'');
	return '__users_table.db';
}

function getTextsDBName(name) {
	return '__texts_table.db';
}

/***
 * record looks like: {'user':user,'original-token': token, 'token':newToken, 'version': settings.getVersion()}
 * @param record
 * @constructor
 */
function UserAttrs(record){
	if(!record) record = {};
	this.currRecord = record;
	var parent  = this;
	this.getVersion = function(){ return parent.currRecord['version']};
	this.getUser = function(){ return parent.currRecord['user']};
	this.getDate = function(){ return parent.currRecord['date']};
	this.getToken = function(){ return parent.currRecord['token']};
	this.getMobile = function(){ return parent.currRecord['mobile']};
	this.getRecord = function(){ return parent.currRecord};

	this.setVersion = function(version){ parent.currRecord['version'] = version;}
	this.setToken = function(token){parent.currRecord['token'] = token;}
	this.setDate = function(date){if(!date) date=new Date(); parent.currRecord['date'] = date;}
	this.setUser = function(user){parent.currRecord['user'] = user;}
	this.setMobile = function(mobile){parent.currRecord['mobile'] = mobile;}
}
/***
 * this function is responsible as a getter and setter for a record in the texts table so we use it without remembereing the format
 * @param record
 * @constructor
 */
function TextsAttrs(record){
	if(!record) record = {};
	this.currRecord = record;
	var parent  = this;
	this.getUser = function(){ return parent.currRecord['user']};
	this.getText = function(){ return parent.currRecord['text']};
	this.getDate = function(){ return parent.currRecord['date']};
	this.getSourceDevice = function(){ return parent.currRecord['device']};
	this.getRecord = function(){ return parent.currRecord};

	this.setUser = function(user){ parent.currRecord['user'] = user;}
	this.setSourceDevice = function(SourceDevice){ parent.currRecord['device'] = SourceDevice;}
	this.setText = function(text){parent.currRecord['text'] = text;}
	this.setDate = function(date){if(!date) date=new Date(); parent.currRecord['date'] = date;}
}


exports.Database = Database;
exports.UserAttrs = UserAttrs;
exports.TextsAttrs = TextsAttrs;
exports.getUsersDBName = getUsersDBName;
exports.getTextsDBName = getTextsDBName;