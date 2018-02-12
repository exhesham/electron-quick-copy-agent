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
function recordToDatarowFormat(rec) {
	var dtRec = [];
	var parsed = new db.TextsAttrs(rec);
	dtRec.push(parsed.getSourceDevice());
	dtRec.push(parsed.getText());
	dtRec.push(parsed.getDate());
	return dtRec;
}

function initTextsTable() {

	function renderData(data) {
		var representativeSpan = {
			tagName: 'span',
			classNames: ['overflown-text'],
			text: data,
		}


		return $('<span>data</span>').addClass('overflown-text').bind("click", function () {
			alert(data)
		});
	}

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
			textsTable.rows.add(parseData(allRecords));
		} else {
			textsTable = $('#textsTable').DataTable({
				data: parseData(allRecords),
				columns: [
					{title: "Source"},
					{
						title: "Text",
						render: function (data, type, row) {

							var res = '<a class="overflown-text" onclick="displayData(this)">' + data + '</a>'

							return res;
						},
					},
					{title: "Date"}
				]
			})
		}

	}).catch(function (err) {
		console.error(err);
	});

}

function createModal(data, options) {
	var defaults = {
		title: "Copy Text",
		content: $("<p />").text(data),
		closeIcon: false,
		id: 'show-text-modal',
		open: function () {
		},
		buttons: [

		]
	};
	var settings = $.extend(true, {}, defaults, options);

	// create the DOM structure
	var $modal = $("<div />").attr("id", settings.id).attr("role", "dialog").addClass("modal fade")
	.append($("<div />").addClass("modal-dialog")
		.append($("<div />").addClass("modal-content")
			.append($("<div />").addClass("modal-header")
			.append($("<h4 />").addClass("modal-title").text(settings.title)))
			.append($("<div />").addClass("modal-body")
			.append(settings.content))
			.append($("<div />").addClass("modal-footer")
			)
		)
	);
	$modal.shown = false;
	$modal.dismiss = function () {
		// loop until its shown
		// this is only because you can do $.fn.alert("utils.js makes this so easy!").dismiss(); in which case it will try to remove it before its finished rendering
		if (!$modal.shown) {
			window.setTimeout(function () {
				$modal.dismiss();
			}, 50);
			return;
		}

		// hide the dialogue
		$modal.modal("hide");
		// remove the blanking
		$modal.prev().remove();
		// remove the dialogue
		$modal.empty().remove();

		$("body").removeClass("modal-open");
	}

	if (settings.closeIcon)
		$modal.find(".modal-header").prepend($("<button />").attr("type", "button").addClass("close").html("&times;").click(function () {
			$modal.dismiss()
		}));

	// add the buttons
	var $footer = $modal.find(".modal-footer");
	for (var i = 0; i < settings.buttons.length; i++) {
		(function (btn) {
			$footer.prepend($("<button />").addClass("btn btn-default")
			.attr("id", btn.id)
			.attr("type", "button")
			.text(btn.text)
			.click(function () {
				btn.click($modal)
			}))
		})(settings.buttons[i]);
	}

	settings.open($modal);

	$modal.on('shown.bs.modal', function (e) {
		$modal.shown = true;
	});
	// show the dialogue
	$modal.modal("show");

	return $modal;
}
function copyToClipboard(elem) {
	// create hidden text element, if it doesn't already exist
	var targetId = "_hiddenCopyText_";
	var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
	var origSelectionStart, origSelectionEnd;
	if (isInput) {
		// can just use the original source element for the selection and copy
		target = elem;
		origSelectionStart = elem.selectionStart;
		origSelectionEnd = elem.selectionEnd;
	} else {
		// must use a temporary form element for the selection and copy
		target = document.getElementById(targetId);
		if (!target) {
			var target = document.createElement("textarea");
			target.style.position = "absolute";
			target.style.left = "-9999px";
			target.style.top = "0";
			target.id = targetId;
			document.body.appendChild(target);
		}
		target.textContent = elem.textContent;
	}
	// select the content
	var currentFocus = document.activeElement;
	target.focus();
	target.setSelectionRange(0, target.value.length);

	// copy the selection
	var succeed;
	try {
		succeed = document.execCommand("copy");
	} catch(e) {
		succeed = false;
	}
	// restore original focus
	if (currentFocus && typeof currentFocus.focus === "function") {
		currentFocus.focus();
	}

	if (isInput) {
		// restore prior selection
		elem.setSelectionRange(origSelectionStart, origSelectionEnd);
	} else {
		// clear temporary content
		target.textContent = "";
	}
	return succeed;
}
function displayData(data) {
	var text = data.children[0].innerText;
	createModal(text,
		{id:'copy-text-dialog',
			buttons:[
			{  id:'close',
				text:'Close',
				click:function(modal){ modal.modal('hide');},
			},
			{  id:'copy',
				text:'Copy',
				click:function(modal){
					copyToClipboard($("#copy-text-dialog .modal-body p")[0])
				},
			},
		]}
	).modal("show");
}

function addNewMessageDomToUI(msgJson) {
	if (!textsTable) {
		initTextsTable();
		return;
	}
	var newRowFormat = recordToDatarowFormat(msgJson)
	textsTable.row.add(newRowFormat).draw().node();
	$('#total-received-texts').text(textsTable.rows().count())
}

function copyMsgToClipboard(msg) {

}

function clearMessages() {

}

if (!textsTable) {
	initTextsTable();
}
exports.addNewMessageDomToUI = addNewMessageDomToUI;
exports.clearMessages = clearMessages;
exports.copyMsgToClipboard = copyMsgToClipboard;