MyHomeworkSpace.Pages.settings = {
	cache: {},
	init: function() {

	},
	open: function() {
		MHSBridge.default.render(MHSBridge.default.h(MHSBridge.default.pages.settings.SettingsPage, {
			classes: MyHomeworkSpace.Classes.list,
			me: MyHomeworkSpace.Me,
			openModal: MHSBridge.default.openModal
		}), null, document.querySelector("#settings > div"));
	}
};