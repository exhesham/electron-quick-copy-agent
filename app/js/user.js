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
		return false;
	};
	/***
	 * will store the token - and return a new generated one that the user will be identified with it.
	 * @param user: instance of User
	 * @returns a new generated token string that will be used in the future.
	 */
	function storeTokenForUser(user,token){
		var userDbName = db.getUserDBName(user);
		// generate the new token
		var newToken = utils.generateToken();
		new db.Database(userDbName).storeRecord({'user':user,'original-token': token, 'token':newToken, 'version': settings.getVersion()});
		return newToken;
	};
}
function User(username){
	/**
	 *
	 * @param metdadata instance returned by the function utils.getMetadataForFile(...)
	 */
	this.commitFileTransferred = function(metdadata){

	};
	this.commitTransferredText = function(metdadata){

	};
}

exports.UsersAgent = UsersAgent;
exports.User = User;