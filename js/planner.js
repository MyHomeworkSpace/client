MyHomeworkSpace.Pages.planner = {
	currentWeek: undefined,
	init: function() {
		$("#plannerPrev").click(function() {
			MyHomeworkSpace.Pages.planner.changeWeek(-1);
		});
		$("#plannerNext").click(function() {
			MyHomeworkSpace.Pages.planner.changeWeek(1);
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
		// fill in days
		for (var i = 0; i < 7; i++) {
			$("#dowDay" + i).text(monday.format("M/D"));
			monday.add(1, "day");
		}

		monday.subtract(7, "days"); // reset variable

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
					$item.append(" " + hwItem.name.substr(hwItem.name.indexOf(" ")));
					if (hwItem.complete == "1") {
						$item.addClass("done");
					}
					var $controls = $('<div class="plannerHWControls"></div>');
						var $done = $('<i class="fa fa-check-square-o"></i>');
							$done.click(function() {
								$(this).parent().parent().toggleClass("done");
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
	},
	open: function() {
		$("#plannerTableBody").html("");
		for (var classIndex in MyHomeworkSpace.Classes.list) {
			var classItem = MyHomeworkSpace.Classes.list[classIndex];
			var $classRow = $('<tr></tr>');
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
		if (!MyHomeworkSpace.Pages.planner.currentWeek) {
			MyHomeworkSpace.Pages.planner.currentWeek = MyHomeworkSpace.Utils.findMonday();
		}
		MyHomeworkSpace.Pages.planner.loadWeek(MyHomeworkSpace.Pages.planner.currentWeek);
	}
};
