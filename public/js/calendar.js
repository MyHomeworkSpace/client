MyHomeworkSpace.Pages.calendar = {
	init: function() {

	},
	open: function() {
		MHSBridge.default.render(MHSBridge.default.h(MHSBridge.default.pages.calendar.CalendarPage, {}), null, document.querySelector("#calendar > div"));
	}
};