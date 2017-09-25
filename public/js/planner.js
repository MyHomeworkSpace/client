MyHomeworkSpace.Pages.planner = {
	currentWeek: undefined,
	changeWeek: function(direction) {
		MyHomeworkSpace.Pages.planner.currentWeek.add(7 * direction, "days");
		MyHomeworkSpace.Pages.planner.loadWeek(MyHomeworkSpace.Pages.planner.currentWeek);
	},
	handleDoneBoxes: function() {
		if (MyHomeworkSpace.Pages.settings.cache.darkenDoneBoxes) {
			$(".plannerHWBox").each(function() {
				var listItems = $(this).children("ul").children("li");
				var listDoneItems = $(this).children("ul").children("li.done");
				if (listItems.length == 0 || listItems.length == listDoneItems.length) {
					$(this).addClass("done");
				} else {
					$(this).removeClass("done");
				}
			});
		}
	},
	renderHeader: function(loading) {
		MHSBridge.default.render(MHSBridge.default.h(MHSBridge.default.ui.WeekHeader, {
			monday: MyHomeworkSpace.Pages.planner.currentWeek,
			loadWeek: MyHomeworkSpace.Pages.planner.loadWeek,
			loadingWeek: loading
		}), null, document.querySelector("#planner .weekHeader"));
	},
	loadWeek: function(monday) {
		MyHomeworkSpace.Pages.planner.currentWeek = monday;
		MyHomeworkSpace.Pages.planner.renderHeader(true);
		$("#plannerTableBody tr td ul").text("");
		$(".announcementDay").text("");
		$("#plannerFridayIndex").text("");
		// fill in days
		for (var i = 0; i < 7; i++) {
			$("#dowDay" + i).text(monday.format("M/D"));
			monday.add(1, "day");
		}

		monday.subtract(7, "days"); // reset variable

		MyHomeworkSpace.API.get("planner/getWeekInfo/" + monday.format("YYYY-MM-DD"), {}, function(xhr) {
			var announcements = xhr.responseJSON.announcements;
			var friday = xhr.responseJSON.friday;
			for (var announcementIndex in announcements) {
				var announcement = announcements[announcementIndex];
				var announcementDay = moment(announcement.date);
				var plannerDow = announcementDay.day();
				if (plannerDow == 0) {
					plannerDow = 7;
				}
				plannerDow--;
				$("#announcementDay" + plannerDow).text(announcement.text);
			}
			if (friday.id != -1) {
				$("#plannerFridayIndex").text(friday.index + " ");
			}
			MyHomeworkSpace.API.get("homework/getWeek/" + monday.format("YYYY-MM-DD"), {}, function(xhr) {
				var hw = xhr.responseJSON.homework;
				for (var hwIndex in hw) {
					var hwItem = hw[hwIndex];
					var due = moment(hwItem.due);
					var plannerDow = due.day();

					if (plannerDow == 0) {
						plannerDow = 7;
					}
					plannerDow--;

					var $item = $('<li></li>');
						$item.addClass("plannerItem");
						$item.attr("data-hwId", hwItem.id);
						if(hwItem.desc != "") {
							$item.tooltip({
								title: hwItem.desc	
							});
						}
						var $name = $('<span></span>');
						MHSBridge.default.render(MHSBridge.default.h(MHSBridge.default.ui.HomeworkName, {
							name: hwItem.name
						}), $name[0]);
						$item.append($name);
						if (hwItem.complete == "1") {
							$item.addClass("done");
						}
						var $controls = $('<div class="plannerHWControls"></div>');
							var $done = $('<i class="fa fa-circle-o toggleable-check"></i>');
								if (hwItem.complete == "1") {
									$done.removeClass("fa-circle-o");
									$done.addClass("fa-check-circle-o");
								}
								$done.click(function() {
									$(this).parent().parent().toggleClass("done");
									if ($(this).hasClass("fa-check-circle-o")) {
										$(this).removeClass("fa-check-circle-o");
										$(this).addClass("fa-circle-o");
									} else {
										$(this).removeClass("fa-circle-o");
										$(this).addClass("fa-check-circle-o");
									}
									MyHomeworkSpace.Pages.homework.markComplete($(this).parent().parent().attr("data-hwId"), ($(this).parent().parent().hasClass("done") ? "1" : "0"));
									MyHomeworkSpace.Pages.planner.handleDoneBoxes();
								});
							$controls.append($done);
							$controls.append(" ");
							var $edit = $('<i class="fa fa-edit"></i>');
								$edit.click(function() {
									MyHomeworkSpace.Pages.homework.edit($(this).parent().parent().attr("data-hwId"));
									MyHomeworkSpace.Pages.planner.handleDoneBoxes();
								});
							$controls.append($edit);
						$item.append($controls);
					$("#plannerTableBody tr[data-classId=" + hwItem.classId + "] td[data-dow=" + plannerDow + "] ul").append($item);
				}
				MyHomeworkSpace.Pages.planner.handleDoneBoxes();
				MyHomeworkSpace.Pages.planner.renderHeader(false);
			});
		});
	},
	open: function() {
		$("#plannerTableBody").html("");
		for (var classIndex in MyHomeworkSpace.Classes.list) {
			var classItem = MyHomeworkSpace.Classes.list[classIndex];
			var $classRow = $('<tr></tr>');
				$classRow.addClass("classRow");
				$classRow.attr("data-classId", classItem.id);
				$classRow.append($('<td></td>').text(classItem.name).addClass("subjectCell"));
				$classRow.append($('<td><ul></ul></td>').addClass("plannerHWBox").attr("data-dow", "0"));
				$classRow.append($('<td><ul></ul></td>').addClass("plannerHWBox").attr("data-dow", "1"));
				$classRow.append($('<td><ul></ul></td>').addClass("plannerHWBox").attr("data-dow", "2"));
				$classRow.append($('<td><ul></ul></td>').addClass("plannerHWBox").attr("data-dow", "3"));
				$classRow.append($('<td><ul></ul></td>').addClass("plannerHWBox").attr("data-dow", "4"));
				$classRow.append($('<td><ul></ul></td>').addClass("plannerHWBox").attr("data-dow", "5"));
				$classRow.append($('<td><ul></ul></td>').addClass("plannerHWBox").attr("data-dow", "6"));
			$("#plannerTableBody").append($classRow);
		}
		var $addButton = $("<button>Add</button>");
			$addButton.addClass("plannerAddButton");
			$addButton.addClass("btn");
			$addButton.addClass("btn-default");
			$addButton.addClass("btn-xs");
			$addButton.click(function() {
				var dueDate = moment(MyHomeworkSpace.Pages.planner.currentWeek);
				// this is kinda hacky but it works so TOO BAD
				for (var i = 0; i < parseInt($(this).parent().attr("data-dow")); i++) {
					dueDate.add(1, "day");
				}
				$("#homeworkName").val("");
				$("#homeworkClass").val($(this).parent().parent().attr("data-classId"));
				$("#homeworkDue").val(dueDate.format("YYYY-MM-DD"));
				$("#homeworkComplete").prop("checked", false);
				$("#homeworkDesc").val("");
				$("#deleteHomeworkModal").hide();
				$("#homeworkModalType").text("Add");
				$("#homeworkModal").attr("data-actionType", "add");
				$("#homeworkName").trigger("input"); // trigger tag system
				$("#homeworkModal").modal();
				$("#addHWClose").click();
			});
		$(".classRow td:not(.subjectCell)").append($addButton);
		if (!MyHomeworkSpace.Pages.planner.currentWeek) {
			MyHomeworkSpace.Pages.planner.currentWeek = MyHomeworkSpace.Utils.findMonday();
		}
		MyHomeworkSpace.Pages.planner.loadWeek(MyHomeworkSpace.Pages.planner.currentWeek);
	}
};
