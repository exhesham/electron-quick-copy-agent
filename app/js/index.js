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
function loadTexts(){

}
function initTextsTable(){
	// allTexts = loadTexts();
	allTexts = [
		['a','b','c']
	];

	$('#textsTable').DataTable( {
		data: allTexts,
		columns: [
			{ title: "Source" },
			{ title: "Date" },
			{ title: "Text" }
		]
	} );
}


function main(){
	initTextsTable();
}

// exports.main = main;
main();