MyHomeworkSpace.Pages.help = {
	init: function() {

	},
	open: function() {
		MHSBridge.default.render(MHSBridge.default.h(MHSBridge.default.ui.PrefixList, {}), null, document.querySelector("#prefixList > div"));
	}
};