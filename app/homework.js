import api from "api.js";

export function edit(id) {
	MHSBridge.default.openModal("loading", {});
	api.get("homework/get/" + id, {}, function(data) {
		MHSBridge.default.openModal("homework", data.homework);
	});
};

export function handleNew() {
	if (MyHomeworkSpace.Page.current() == "homework" || MyHomeworkSpace.Page.current() == "planner" || MyHomeworkSpace.Page.current() == "classes") {
		MyHomeworkSpace.Page.show(MyHomeworkSpace.Page.current());
	}
};

export function markComplete(id, complete) {
	api.get("homework/get/" + id, {}, function(data) {
		var hwItem = data.homework;
		hwItem.complete = complete;
		api.post("homework/edit", hwItem, function(data) {
			// yay
		});
	});
};