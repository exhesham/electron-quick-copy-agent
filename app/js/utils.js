/***
 * Generate a metadata record for the file. this record according to the diagram will be saved at
 * user metadata->history->files[]
 * @param filename the recieved file name
 * @param receivedAsFolder if the file is part of a folder that the user sent
 * @param user the record of the user. this json contains the settings metadata
 * @returns {{filename: *, originalName: string, originalFullName: string, distName: string, receivedAsFolder: *, date: string}}
 */
function getMetadataForFile(filename, receivedAsFolder, user){
	//TODO:Take the settings from the user and check if can create file with this name
	return{	filename:filename,
			originalName:'',
			originalFullName:'',
			distName:'',
			receivedAsFolder:receivedAsFolder,
			date: ''
	};
}

exports.getMetadataForFile = getMetadataForFile;