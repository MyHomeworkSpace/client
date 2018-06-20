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
				$item.data("class", classItem);
				var $name = $('<span></span>');
					MHSBridge.default.render(MHSBridge.default.h(MHSBridge.default.ui.ClassName, {
						classObject: classItem
					}), $name[0]);
				$item.append($name);
				var $teacher = $('<div class="classTeacher"></div>');
					$teacher.text(classItem.teacher);
				$item.append($teacher);
				var $swap = $('<i class="fa fa-arrows-v"></i>');
					$swap.click(function() {
						MHSBridge.default.openModal("classSwap", $(this).parent().data("class"));
					});
				$item.append($swap);
				var $edit = $('<i class="fa fa-edit"></i>');
					$edit.click(function() {
						MHSBridge.default.openModal("class", $(this).parent().data("class"));
					});
				$item.append($edit);
			$(".classList ul").append($item);
		}
	}
};
