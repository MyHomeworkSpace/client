MyHomeworkSpace.Pages.homework = {
	init: function() {
		$(document).keyup(function(e) {
			if (e.keyCode == 13) {
				if ($("#homeworkModal").hasClass("in")) { // if hw modal is open
					$("#submitHomeworkModal").click();
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
		$("#homeworkName").highlightTextarea({
			words: MyHomeworkSpace.Prefixes.list,
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
		$("#homeworkTomorrow .hwList").html('<ul></ul');
		$("#homeworkSoon .hwList").html('<ul></ul>');
		$("#homeworkLongterm .hwList").html('<ul></ul>');
		var classes = MyHomeworkSpace.Classes.list;
		MyHomeworkSpace.API.get("homework/getHWView", {}, function(xhr) {
			var hw = xhr.responseJSON.homework;
			var showMonday = (moment().day() == 5 || moment().day() == 6);
			var tomorrowDaysToThreshold = 2;
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

				if (dueText.indexOf(' ') > -1) {
					dueText = dueText[0].toLowerCase() + dueText.substr(1);
				}

				var $item = $('<div class="hwItem"></div>');

					$item.attr("data-hwId", hwItem.id);
					if (hwItem.complete == "1") {
						$item.addClass("done");
					}
					var $options = $('<div class="hwOptions"></div>');
						var $done = $('<i class="fa fa-square-o toggleable-check"></i>');
							if (hwItem.complete == "1") {
								$done.removeClass("fa-square-o");
								$done.addClass("fa-check-square-o");
							}
							$done.click(function() {
								$(this).parent().parent().toggleClass("done");
								if ($(this).hasClass("fa-check-square-o")) {
									$(this).removeClass("fa-check-square-o");
									$(this).addClass("fa-square-o");
								} else {
									$(this).removeClass("fa-square-o");
									$(this).addClass("fa-check-square-o");
								}
								MyHomeworkSpace.Pages.homework.markComplete($(this).parent().parent().attr("data-hwId"), ($(this).parent().parent().hasClass("done") ? "1" : "0"));
							});
						$options.append($done);
						$options.append(" ");
						var $edit = $('<i class="fa fa-edit"></i>');
							$edit.click(function() {
								MyHomeworkSpace.Pages.homework.edit($(this).parent().parent().attr("data-hwId"));
							});
						$options.append($edit);
					$item.append($options);
					var $name = $('<div class="hwName"></div>');
						$name.append($("<span></span>").text(prefix).addClass(MyHomeworkSpace.Prefixes.matchClass(prefix)));
						if (hwItem.name.indexOf(" ") != -1) {
							$name.append($("<span></span>").text(hwItem.name.substr(hwItem.name.indexOf(" "))));
						}
						if (daysTo < 1) {
							$name.append(" (late)");
						}
					$item.append($name);
					var $subtext = $('<div class="hwSubText"></div>');
						var keyword = "due ";
						if (prefix.toLowerCase() == "test" || prefix.toLowerCase() == "exam" || prefix.toLowerCase() == "midterm" || prefix.toLowerCase() == "quiz" || prefix.toLowerCase() == "ica" || prefix.toLowerCase() == "lab") {
							keyword = "on ";
						}
						if (keyword == "on " && dueText.toLowerCase() == "tomorrow") {
							keyword = "";
						}
						$subtext.text(keyword + dueText);
						for (var classIndex in classes) {
							if (classes[classIndex].id == hwItem.classId) {
								$subtext.append(" in " + classes[classIndex].name)
							}
						}
					$item.append($subtext);

					if (daysTo < 1) {
						$item.addClass("hwLate");
					}

				if (daysTo < tomorrowDaysToThreshold) {
					$("#homeworkTomorrow .hwList ul").append($item);
				} else if (daysTo < 5) {
					$("#homeworkSoon .hwList ul").append($item);
				} else {
					$("#homeworkLongterm .hwList ul").append($item);
				}
			}
		});
	}
};
