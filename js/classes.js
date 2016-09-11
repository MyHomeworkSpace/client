MyHomeworkSpace.Pages.classes = {
	init: function() {
		$("#addClass").click(function() {
			$("#classModalType").text("Add");
			$("#classModal").modal();
		});
		$("#submitClassModal").click(function() {
			$("#classModal").modal("hide");
			$("#loadingModal").modal({
				backdrop: "static",
				keyboard: false
			});
			MyHomeworkSpace.API.post("classes/add", {
				name: $("#className").val(),
				teacher: $("#classTeacher").val()
			}, function(xhr) {
				MyHomeworkSpace.Classes.load(function() {
					MyHomeworkSpace.Classes.reload();
					$("#loadingModal").modal("hide");
					MyHomeworkSpace.Page.show("classes");
				});
			});
		});
	},
	open: function() {
		$(".classList").html('<ul></ul>');
		for (var classIndex in MyHomeworkSpace.Classes.list) {
			var classItem = MyHomeworkSpace.Classes.list[classIndex];
			var $item = $('<li class="classItem"></li>');
				var $name = $('<div class="className"></div>');
					$name.text(classItem.name);
				$item.append($name);
				var $teacher = $('<div class="classTeacher"></div>');
					$teacher.text(classItem.teacher);
				$item.append($teacher);
			$(".classList ul").append($item);
		}
	}
};
