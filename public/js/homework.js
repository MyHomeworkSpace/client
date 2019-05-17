MyHomeworkSpace.Pages.homework = {
	init: function() {},

	edit: function(id) {
		MHSBridge.default.openModal("loading", {});
		MyHomeworkSpace.API.get("homework/get/" + id, {}, function(data) {
			MHSBridge.default.openModal("homework", data.homework);
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
