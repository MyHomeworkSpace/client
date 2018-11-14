MyHomeworkSpace.Pages.admin = {
	init: function() {

	},
	open: function() {
		MHSBridge.default.render(MHSBridge.default.h(MHSBridge.default.pages.admin.AdminPage, {}), null, document.querySelector("#admin > div"));
	}
};