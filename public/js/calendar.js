MyHomeworkSpace.Pages.calendar = {
	init: function() {

	},
	open: function() {
		MHSBridge.default.render(MHSBridge.default.h(MHSBridge.default.pages.calendar.CalendarPage, {
			openModal: MHSBridge.default.openModal
		}), null, document.querySelector("#calendar > div"));
	}
};