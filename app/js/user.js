const path = require('path');
const db = require( path.resolve( __dirname, "database.js" ));
const utils = require( path.resolve( __dirname,"utils.js" ) );
const settings = require( path.resolve( __dirname,"settings.js" ) );

function UsersAgent() {
	return {
		isExist:isExist,
		isValidToken:isValidToken,
		getUserByToken:getUserByToken,
		storeTokenForUser:storeTokenForUser,

	}
	function isExist(username){
		return false;
	};
	function isValidToken(username, token){
		return false;
	};
	function getUserByToken(token){
		//TODO: return user record from database and return User instance
		return new Promise(function (resolve, reject) {
			new db.Database(db.getUsersDBName()).findRecord('token',token).then(function(res){
				resolve(new User(new db.UserAttrs(res)));
			}).catch(reject)
		})
	};
	/***
	 * will store the token - and return a new generated one that the user will be identified with it.
	 * @param user: instance of User
	 * @returns a new generated token string that will be used in the future.
	 */
	function storeTokenForUser(user,device, token){
		//TODO: Delete the user if exists...
		var userDbName = db.getUsersDBName();
		// generate the new token without the rest of the qr details. the mobile is going to use it for identification
		var newToken = utils.generateToken();
		var newUser = new db.UserAttrs();
		newUser.setUser(user);
		newUser.setToken(newToken);
		newUser.setVersion( settings.getVersion());
		newUser.setDate();
		newUser.setMobile(device);
		new db.Database(userDbName).storeRecord(newUser.getRecord());
		return newToken;
	};
}
function User(record){
	/**
	 *
	 * @param metdadata instance returned by the function utils.getMetadataForFile(...)
	 */
	this.record = record;
	this.commitFileTransferred = function(metdadata){

	};
	this.commitTransferredText = function(record){
		var textsDbName = db.getTextsDBName();
		new db.Database(textsDbName).storeRecord(new db.TextsAttrs(record).getRecord());
	};
}

exports.UsersAgent = UsersAgent;
exports.User = User;