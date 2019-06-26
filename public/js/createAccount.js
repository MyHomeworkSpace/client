MyHomeworkSpace.Pages.createAccount = {
	init: function() {
		MHSBridge.default.render(MHSBridge.default.h(MHSBridge.default.auth.CreateAccountForm, {
			
		}), document.querySelector("#createAccount > div"));
	}
};
