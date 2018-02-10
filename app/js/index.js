if (!path)
	var path = require('path');
var database = require(path.resolve(__dirname, "js", "database.js"));
var os = require('os');
var pusage = require('pidusage');
var net = require("net");

const bandwidth = 0;

function highlight(tabId) {
	var tab = document.getElementById(tabId);
	if (!tab) return;
	var page = document.getElementById(tabId + "Page");
	if (!page) return;

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


var textsTable = null;

function loadTexts() {
	var textsDbName = db.getTextsDBName();
	return new db.Database(textsDbName).getRecords();
}

function initTextsTable() {
	function parseData(allRecords) {
		console.debug('parseData called with ' + allRecords)
		var allTexts = [];
		allRecords.forEach(function (rec) {
			console.log('updating record index ' + i)
			var parsed = new db.TextsAttrs(rec);
			var dtRec = [];
			dtRec.push(parsed.getSourceDevice());
			dtRec.push(parsed.getText());
			dtRec.push(parsed.getDate());
			allTexts.push(dtRec);
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

function loadCharts() {
	google.charts.load('current', {'packages': ['gauge']});
	google.charts.setOnLoadCallback(drawChart);

	function getCpuUsage() {
		pusage.stat(process.pid, function (err, stat) {

			expect(err).to.be.null
			expect(stat).to.be.an('object')
			expect(stat).to.have.property('cpu')
			expect(stat).to.have.property('memory')

			console.log('Pcpu: %s', stat.cpu)
			console.log('Mem: %s', stat.memory) //those are bytes

		})
	}

	function drawChart() {

		var data = google.visualization.arrayToDataTable([
			['Label', 'Value'],
			['Memory', 0],
			['CPU', 0],
			['Network', 68]
		]);

		var options = {
			width: 400, height: 120,
			redFrom: 90, redTo: 100,
			yellowFrom: 75, yellowTo: 90,
			minorTicks: 5
		};

		var chart = new google.visualization.Gauge(document.getElementById('chart_div'));

		chart.draw(data, options);

		setInterval(function () {
			pusage.stat(process.pid, function (err, stat) {
				data.setValue(0, 1,  stat.memory/os.totalmem()*100);
				data.setValue(1, 1, stat.cpu);
				data.setValue(2, 1, bandwidth);   // bandwidth
				chart.draw(data, options);
			})

		}, 3000);
		setInterval(function () {

			chart.draw(data, options);
		}, 26000);
	}
}

function main() {
	// tray icon tutorial: https://www.tutorialspoint.com/electron/electron_system_tray.htm
	const {remote} = require('electron')
	const {Tray, Menu} = remote
	const path = require('path')

	let trayIcon = new Tray(path.join('images', 'logo.png'))

	const trayMenuTemplate = [
		{
			label: 'Empty Application',
			enabled: false
		},

		{
			label: 'Settings',
			click: function () {
				console.log("Clicked on settings")
			}
		},

		{
			label: 'Help',
			click: function () {
				console.log("Clicked on Help")
			}
		}
	]

	let trayMenu = Menu.buildFromTemplate(trayMenuTemplate)
	trayIcon.setContextMenu(trayMenu)
}

// exports.main = main;
// exports.highlight = highlight;
main();
loadCharts();