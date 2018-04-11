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
		$("#deleteHomeworkModal").click(function() {
			if (confirm("Are you sure you want to delete this?")) {
				$("#homeworkModal").modal('hide');
				$("#loadingModal").modal({
					backdrop: "static",
					keyboard: false
				});
				MyHomeworkSpace.API.post("homework/delete", {
					id: $("#homeworkModal").attr("data-actionId")
				}, function(data) {
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
				MyHomeworkSpace.API.post("homework/add", hwItem, function(data) {
					MyHomeworkSpace.Pages.homework.handleNew();
					$("#loadingModal").modal('hide');
				});
			} else {
				hwItem.id = id;
				MyHomeworkSpace.API.post("homework/edit", hwItem, function(data) {
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
			var newItem = {};
			for (var key in item) {
				newItem[key] = item[key];
			}
			newItem.background = "#" + item.background;
			newItem.color = "#" + item.color;
			filteredWords.push(newItem);
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
		MyHomeworkSpace.API.get("homework/get/" + id, {}, function(data) {
			var hw = data.homework;

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
		MyHomeworkSpace.API.get("homework/get/" + id, {}, function(data) {
			var hwItem = data.homework;
			hwItem.complete = complete;
			MyHomeworkSpace.API.post("homework/edit/", hwItem, function(data) {
				// yay
			});
		});
	},

	open: function() {
		MHSBridge.default.render(MHSBridge.default.h(MHSBridge.default.pages.homework.HomeworkPage, {}), null, document.querySelector("#homework > div"));
	}
};
