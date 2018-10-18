MyHomeworkSpace.Pages.classes = {
	open: function() {
		MHSBridge.default.render(MHSBridge.default.h(MHSBridge.default.pages.classes.ClassesPage, {
			openModal: MHSBridge.default.openModal
		}), null, document.querySelector("#classes > div"));
	}
};
