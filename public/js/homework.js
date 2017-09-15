MyHomeworkSpace.Pages.homework = {
	init: function() {
		$(document).keyup(function(e) {
			if (e.keyCode == 13) {
				if ($("#homeworkModal").hasClass("in")) { // if hw modal is open
					if ($("#homeworkDesc:focus").length == 0) { // if you aren't editing the description
						$("#submitHomeworkModal").click();
					}
				}
			}
		});
		$("#homeworkOverdueDone").click(function() {
			MyHomeworkSpace.API.post("homework/markOverdueDone", {}, function(xhr) {
				MyHomeworkSpace.Pages.homework.open();
			});
		});
		$("#deleteHomeworkModal").click(function() {
			if (confirm("Are you sure you want to delete this?")) {
				$("#homeworkModal").modal('hide');
				$("#loadingModal").modal({
					backdrop: "static",
					keyboard: false
				});
				MyHomeworkSpace.API.post("homework/delete", {
					id: $("#homeworkModal").attr("data-actionId")
				}, function(xhr) {
					MyHomeworkSpace.Pages.homework.handleNew();
					$("#loadingModal").modal('hide');
				});
			}
		});
		$("#submitHomeworkModal").click(function() {
			if ($("#homeworkName").val() == "") {
				alert("You must enter a name.");
				return;
			}
			if ($("#homeworkDue").val() == "") {
				alert("You must enter a due date.");
				return;
			}
			if ($("#homeworkClass").val() == -1) {
				alert("You must select a class.");
				return;
			}
			var type = $("#homeworkModal").attr("data-actionType");
			var id = $("#homeworkModal").attr("data-actionId");

			var hwItem = {
				name: $("#homeworkName").val(),
				due: $("#homeworkDue").val(),
				desc: $("#homeworkDesc").val(),
				complete: ($("#homeworkComplete").prop("checked") ? "1" : "0"),
				classId: $("#homeworkClass").val()
			};

			$("#homeworkModal").modal('hide');
			$("#loadingModal").modal({
				backdrop: "static",
				keyboard: false
			});
			if (type == "add") {
				MyHomeworkSpace.API.post("homework/add", hwItem, function(xhr) {
					MyHomeworkSpace.Pages.homework.handleNew();
					$("#loadingModal").modal('hide');
				});
			} else {
				hwItem.id = id;
				MyHomeworkSpace.API.post("homework/edit", hwItem, function(xhr) {
					MyHomeworkSpace.Pages.homework.handleNew();
					$("#loadingModal").modal('hide');
				});
			}
		});
	},
	onLogin: function() {
		var filteredWords = [];
		for (var index in MyHomeworkSpace.Prefixes.list) {
			var item = MyHomeworkSpace.Prefixes.list[index];
			item.background = "#" + item.background;
			item.color = "#" + item.color;
			filteredWords.push(item);
		}
		$("#homeworkName").highlightTextarea({
			words: filteredWords,
			firstWord: true,
			caseSensitive: false
		});
	},
	edit: function(id) {
		$("#loadingModal").modal({
			backdrop: "static",
			keyboard: false
		});
		MyHomeworkSpace.API.get("homework/get/" + id, {}, function(xhr) {
			var hw = xhr.responseJSON.homework;

			$("#homeworkModal").attr("data-actionType", "edit");
			$("#homeworkModal").attr("data-actionId", hw.id);
			$("#homeworkModalType").text("Edit");
			$("#homeworkName").val(hw.name);
			$("#homeworkDue").val(hw.due);
			$("#homeworkDue").next(".form-control").children("button").text(moment(hw.due).format("dddd, MMMM Do, YYYY"));
			$("#homeworkDue").next(".form-control").children("div").datepicker("setDate", moment(hw.due).toDate());
			$("#homeworkDesc").val(hw.desc);
			$("#homeworkComplete").prop("checked", (hw.complete == "1"));
			$("#homeworkClass").val(hw.classId);

			$("#deleteHomeworkModal").show();

			$("#loadingModal").modal('hide');
			$("#homeworkName").trigger("input"); // trigger tag system
			$("#homeworkModal").modal();
		});
	},
	handleNew: function() {
		if (MyHomeworkSpace.Page.current() == "homework" || MyHomeworkSpace.Page.current() == "planner") {
			MyHomeworkSpace.Page.show(MyHomeworkSpace.Page.current());
		}
	},
	markComplete: function(id, complete) {
		MyHomeworkSpace.API.get("homework/get/" + id, {}, function(xhr) {
			var hwItem = xhr.responseJSON.homework;
			hwItem.complete = complete;
			MyHomeworkSpace.API.post("homework/edit/", hwItem, function(xhr) {
				// yay
			});
		});
	},
	open: function() {
		$("#homeworkOverdue").hide();
		$("#homeworkOverdue .hwList").html('<ul></ul>');
		$("#homeworkTomorrow .hwList").html('<ul></ul>');
		$("#homeworkSoon .hwList").html('<ul></ul>');
		$("#homeworkLongterm .hwList").html('<ul></ul>');
		var classes = MyHomeworkSpace.Classes.list;
		MyHomeworkSpace.API.get("homework/getHWView", {}, function(xhr) {
			var hw = xhr.responseJSON.homework;
			var showMonday = (moment().day() == 5 || moment().day() == 6);
			var tomorrowDaysToThreshold = 2;
			var showOverdue = false;
			if (showMonday) {
				$("#homeworkTomorrowTitle").text("Monday");
				if (moment().day() == 5) {
					tomorrowDaysToThreshold = 4;
				} else {
					tomorrowDaysToThreshold = 3;
				}
			}
			for (var hwIndex in hw) {
				var hwItem = hw[hwIndex];

				var due = moment(hwItem.due);
				var dueText = due.calendar().split(" at ")[0];
				var daysTo = Math.ceil(due.diff(moment()) / 1000 / 60 / 60 / 24);
				var prefix = hwItem.name.split(" ")[0];

				if (daysTo < 1 && hwItem.complete == "1") {
					continue;
				}

				if (prefix.toLowerCase() == "none" || prefix.toLowerCase() == "nohw") {
					continue;
				}

				if (dueText.indexOf(' ') > -1) {
					dueText = dueText[0].toLowerCase() + dueText.substr(1);
				}

				var $item = $('<div class="hwItem"></div>');

					MHSBridge.default.render(MHSBridge.default.h(MHSBridge.default.pages.homework.HomeworkItem, {
						classes: MyHomeworkSpace.Classes.list,
						homework: hwItem,
						edit: function(id) {
							MyHomeworkSpace.Pages.homework.edit(id);
						},
						setComplete: function(id, complete) {
							MyHomeworkSpace.Pages.homework.markComplete(id, (complete ? "1" : "0"));
						}
					}), null, $item[0]);

				if (daysTo < 1) {
					showOverdue = true;
					$("#homeworkOverdue .hwList ul").append($item);
				} else if (daysTo < tomorrowDaysToThreshold) {
					$("#homeworkTomorrow .hwList ul").append($item);
				} else if (daysTo < 5) {
					$("#homeworkSoon .hwList ul").append($item);
				} else {
					$("#homeworkLongterm .hwList ul").append($item);
				}
			}
			if (showOverdue) {
				$("#homeworkOverdue").show();
			}
		});
	}
};
