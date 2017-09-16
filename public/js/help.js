MyHomeworkSpace.Pages.help = {
	init: function() {

	},
	open: function() {
		MHSBridge.default.render(MHSBridge.default.h(MHSBridge.default.pages.help.HelpPage, {}), null, document.querySelector("#help > div"));
	}
};