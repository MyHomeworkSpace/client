MyHomeworkSpace.Pages.classes = {
	init: function() {
		$("#addClass").click(function() {
			$("#className").val("");
			$("#classTeacher").val("");
			$("#classModal").attr("data-actionType", "add");
			$("#classModalType").text("Add");
			$("#classModal").modal();
		});
		$("#submitClassModal").click(function() {
			var type = $("#classModal").attr("data-actionType");
			var id = $("#classModal").attr("data-actionId");
			$("#classModal").modal("hide");
			$("#loadingModal").modal({
				backdrop: "static",
				keyboard: false
			});
			var classItem = {
				name: $("#className").val(),
				teacher: $("#classTeacher").val()
			};
			var classPostDone = function(xhr) {
				MyHomeworkSpace.Classes.load(function() {
					MyHomeworkSpace.Classes.reload();
					$("#loadingModal").modal("hide");
					MyHomeworkSpace.Page.show("classes");
				});
			};

			if (type == "add") {
				MyHomeworkSpace.API.post("classes/add", classItem, classPostDone);
			} else {
				classItem.id = id;
				MyHomeworkSpace.API.post("classes/edit", classItem, classPostDone);
			}
		});
	},
	open: function() {
		$(".classList").html('<ul></ul>');
		for (var classIndex in MyHomeworkSpace.Classes.list) {
			var classItem = MyHomeworkSpace.Classes.list[classIndex];
			var $item = $('<li class="classItem"></li>');
				$item.attr("data-classId", classItem.id);
				var $name = $('<div class="className"></div>');
					$name.text(classItem.name);
				$item.append($name);
				var $teacher = $('<div class="classTeacher"></div>');
					$teacher.text(classItem.teacher);
				$item.append($teacher);
				var $edit = $('<i class="fa fa-edit"></i>');
					$edit.click(function() {
						var $that = $(this);
						MyHomeworkSpace.API.get("classes/get/" + $(this).parent().attr("data-classId"), {}, function(xhr) {
							var classItem = xhr.responseJSON.class;
							$("#classModal").attr("data-actionType", "edit");
							$("#classModal").attr("data-actionId", $that.parent().attr("data-classId"));
							$("#className").val(classItem.name);
							$("#classTeacher").val(classItem.teacher);
							$("#classModal").modal();
						});
					});
				$item.append($edit);
			$(".classList ul").append($item);
		}
	}
};
