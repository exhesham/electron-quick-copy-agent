if(!path)
var  path = require('path');
var database = require( path.resolve( __dirname,"js", "database.js" ));
function highlight(tabId) {
	var tab = document.getElementById(tabId);
	if(!tab) return;
	var page = document.getElementById(tabId + "Page");
	if(!page) return;

	// deactivate all the rest
	var otherTabs = document.getElementsByClassName('tab');
	// loop through all 'otherTabs' elements
	for (i = 0; i < otherTabs.length; i++) {
		// Remove the class 'active' if it exists
		otherTabs[i].classList.remove('active')
	}

	var allPages = document.getElementsByClassName('page');
	// loop through all 'otherTabs' elements
	for (i = 0; i < allPages.length; i++) {
		// Remove the class 'active' if it exists
		allPages[i].classList.add('hidden');
	}

	tab.classList.add('active');    // make clicked active
	page.classList.remove('hidden');    // make clicked active
}

var allTexts = [];
var textsTable = null;
function loadTexts(){
	var textsDbName = db.getTextsDBName();
	return new db.Database(textsDbName).getRecords();
}
function initTextsTable(){

	loadTexts().then(function (allRecords) {
		allTexts = [];
		for(var i in allRecords){
			console.log('updating record index ' + i)
			var rec = allRecords[i];
			var parsed = new db.TextsAttrs(rec);
			var dtRec = [];
			dtRec.push(parsed.getSourceDevice());
			dtRec.push(parsed.getDate());
			dtRec.push(parsed.getText());
			allTexts.push(dtRec);

		}
		if(textsTable != null){
			textsTable.data(allTexts)
		}else{
			textsTable = $('#textsTable').DataTable( {
				data: allTexts,
				columns: [
					{ title: "Source" },
					{ title: "Date" },
					{ title: "Text" }
				]
			} );
		}

	}).catch(function (err) {
		console.error(err);
	});

}


function main(){

}

// exports.main = main;
// exports.highlight = highlight;
main();