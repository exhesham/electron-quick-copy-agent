function UsersAgent() {
	return {
		isExist:isExist,
		isValidToken:isValidToken,
		getUserByToken:getUserByToken,
		generateTokenForUser:generateTokenForUser,

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
	 * will generate a token for the user so the user will send it for each file/text/folder transfer
	 * @param user: instance of User
	 * @returns a token string
	 */
	function generateTokenForUser(user){
		return 'sha256 for the user';
	};
}
function User(username){

	this.saveFile = function(fileMetadata){

	}
	/**
	 *
	 * @param metdadata instance returned by the function utils.getMetadataForFile(...)
	 */
	this.commitFileTransferred = function(metdadata){

	};
	this.commitTransferredText = function(metdadata){

	};
}