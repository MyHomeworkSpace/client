MyHomeworkSpace.Pages.planner = {
	open: function() {
		MHSBridge.default.render(MHSBridge.default.h(MHSBridge.default.pages.planner.PlannerPage, {
			classes: MyHomeworkSpace.Classes.list,
			openModal: MHSBridge.default.openModal
		}), null, document.querySelector("#planner > div"));
	}
};
