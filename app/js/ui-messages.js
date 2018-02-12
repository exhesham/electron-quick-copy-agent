

var textsTable = null;

function loadTexts() {
	var textsDbName = db.getTextsDBName();
	return new db.Database(textsDbName).getRecords();
}

/***
 * receives a TextsAttrs
 * @param rec
 * @returns {Array}
 */
function recordToDatarowFormat(rec){
	var dtRec = [];
	var parsed = new db.TextsAttrs(rec);
	dtRec.push(parsed.getSourceDevice());
	dtRec.push(parsed.getText());
	dtRec.push(parsed.getDate());
	return dtRec;
}
function initTextsTable() {
	function parseData(allRecords) {
		// update counter
		$('#total-received-texts').text(allRecords.length)
		var allTexts = [];
		allRecords.forEach(function (rec) {
			allTexts.push(recordToDatarowFormat(rec));
		});
		return allTexts;
	}

	loadTexts().then(function (allRecords) {

		if (textsTable != null) {
			textsTable.data(parseData(allRecords))
		} else {
			textsTable = $('#textsTable').DataTable({
				data: parseData(allRecords),
				columns: [
					{title: "Source"},
					{title: "Text"},
					{title: "Date"}
				]
			});
		}

	}).catch(function (err) {
		console.error(err);
	});

}

function addNewMessageDomToUI(msgJson){
	if(!textsTable){
		initTextsTable();
		return;
	}
	textsTable.rows.add(recordToDatarowFormat(msgJson));
	$('#total-received-texts').text(textsTable.data.count())
}

function copyMsgToClipboard(msg){

}

function clearMessages(){

}
if(!textsTable){
	initTextsTable();
}
// exports.addNewMessageDomToUI = addNewMessageDomToUI;
// exports.clearMessages = clearMessages;
// exports.copyMsgToClipboard = copyMsgToClipboard;