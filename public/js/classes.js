MyHomeworkSpace.Pages.classes = {
	init: function() {
		$("#addClass").click(function() {
			MHSBridge.default.openModal("class", {});
		});
	},
	handleNew: function() {
		MyHomeworkSpace.Classes.load(function() {
			MyHomeworkSpace.Classes.reload();
			$("#loadingModal").modal("hide");
			MyHomeworkSpace.Page.show("classes");
		});
	},
	open: function() {
		$("#classPane").hide();
		$(".classList").html('<ul></ul>');
		for (var classIndex in MyHomeworkSpace.Classes.list) {
			var classItem = MyHomeworkSpace.Classes.list[classIndex];
			var $item = $('<li class="classItem"></li>');
				$item.attr("data-classId", classItem.id);
				var $colorBar = $('<div class="classColorBar"></div>');
					$colorBar.css("background-color", "#" + classItem.color);
				$item.append($colorBar);
				var $name = $('<div class="className"></div>');
					$name.text(classItem.name);
				$item.append($name);
				var $teacher = $('<div class="classTeacher"></div>');
					$teacher.text(classItem.teacher);
				$item.append($teacher);
			var $swap = $('<i class="fa fa-arrows-v"></i>');
				$swap.click(function() {
					var $that = $(this);
					var currentId = $(this).parent().attr("data-classId");
					MyHomeworkSpace.API.get("classes/get/" + currentId, {}, function(xhr) {
						$("#classSwapOptions").text("");
						$("#classSwapModal").attr("data-classId", currentId);
						var classItem = xhr.responseJSON.class;
						for (var classIndex in MyHomeworkSpace.Classes.list) {
							var thisClassItem = MyHomeworkSpace.Classes.list[classIndex];
							if (thisClassItem.id == currentId) {
								continue;
							}
							var $classItem = $('<li class="classSwapItem"></li>');
								$classItem.attr("data-classId", thisClassItem.id);
								$classItem.text(thisClassItem.name);
								$classItem.click(function() {
									var oldId = $("#classSwapModal").attr("data-classId");
									var newId = $(this).attr("data-classId");
									$("#classSwapModal").modal('hide');
									$("#loadingModal").modal({
										backdrop: "static",
										keyboard: false
									});
									MyHomeworkSpace.API.post("classes/swap", {
										id1: oldId,
										id2: newId
									}, function(response) {
										MyHomeworkSpace.Pages.classes.handleNew();
									});
								});
							$("#classSwapOptions").append($classItem);
						}
						$(".classSwapName").text(classItem.name);
						$("#classSwapModal").modal();
					});
				});
			$item.append($swap);
			var $edit = $('<i class="fa fa-edit"></i>');
				$edit.click(function() {
					var $that = $(this);
					MyHomeworkSpace.API.get("classes/get/" + $(this).parent().attr("data-classId"), {}, function(xhr) {
						MHSBridge.default.openModal("class", xhr.responseJSON.class);
					});
				});
			$item.append($edit);
			$(".classList ul").append($item);
		}
	}
};
