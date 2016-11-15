MyHomeworkSpace.Pages.planner = {
	currentWeek: undefined,
	init: function() {
		$("#plannerPrev").click(function() {
			MyHomeworkSpace.Pages.planner.changeWeek(-1);
		});
		$("#plannerNext").click(function() {
			MyHomeworkSpace.Pages.planner.changeWeek(1);
		});
		$("#plannerWeek").tooltip();
		$("#plannerWeek").click(function() {
			$.datepicker._gotoToday = function (id) {
				$(id).datepicker('setDate', new Date());
				$('.ui-datepicker-current-day').click();
			};
			$("body").datepicker("dialog", MyHomeworkSpace.Pages.planner.currentWeek.toDate(), function(dateStr) {
				var monday = moment(dateStr);
				while (monday.day() != 1) {
					monday.subtract(1, "day");
				}
				MyHomeworkSpace.Pages.planner.loadWeek(monday);
			}, {
				showButtonPanel: true
			});
		});
	},
	changeWeek: function(direction) {
		MyHomeworkSpace.Pages.planner.currentWeek.add(7 * direction, "days");
		MyHomeworkSpace.Pages.planner.loadWeek(MyHomeworkSpace.Pages.planner.currentWeek);
	},
	loadWeek: function(monday) {
		MyHomeworkSpace.Pages.planner.currentWeek = monday;
		$("#plannerWeek").text(monday.format("M/D"));
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
						$item.append($('<span></span>').text(hwItem.name.split(" ")[0]).addClass(MyHomeworkSpace.Prefixes.matchClass(hwItem.name.split(" ")[0])));
						if (hwItem.name.indexOf(" ") != -1) {
							$item.append($('<span></span').text(" " + hwItem.name.substr(hwItem.name.indexOf(" "))));	
						}
						if (hwItem.complete == "1") {
							$item.addClass("done");
						}
						var $controls = $('<div class="plannerHWControls"></div>');
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
							$controls.append($done);
							$controls.append(" ");
							var $edit = $('<i class="fa fa-edit"></i>');
								$edit.click(function() {
									MyHomeworkSpace.Pages.homework.edit($(this).parent().parent().attr("data-hwId"));
								});
							$controls.append($edit);
						$item.append($controls);
					$("#plannerTableBody tr[data-classId=" + hwItem.classId + "] td[data-dow=" + plannerDow + "] ul").append($item);
				}
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
				$classRow.append($('<td><ul></ul></td>').attr("data-dow", "0"));
				$classRow.append($('<td><ul></ul></td>').attr("data-dow", "1"));
				$classRow.append($('<td><ul></ul></td>').attr("data-dow", "2"));
				$classRow.append($('<td><ul></ul></td>').attr("data-dow", "3"));
				$classRow.append($('<td><ul></ul></td>').attr("data-dow", "4"));
				$classRow.append($('<td><ul></ul></td>').attr("data-dow", "5"));
				$classRow.append($('<td><ul></ul></td>').attr("data-dow", "6"));
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
