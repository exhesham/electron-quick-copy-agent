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
	 * will parse the generated qr code and store it.
	 * @param user: instance of User
	 * @returns a token string
	 */
	function storeTokenForUser(user){
		return 'sha256 for the user';
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