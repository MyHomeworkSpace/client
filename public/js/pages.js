function createComponentPage(component, id) {
	return {
		open: function(params) {
			MHSBridge.default.render(MHSBridge.default.h(component, {
				params: params,
				classes: MyHomeworkSpace.Classes.list,
				me: MyHomeworkSpace.Me,
				openModal: MHSBridge.default.openModal
			}), null, document.querySelector("#" + id + " > div"));
		}
	};
}

MyHomeworkSpace.Pages.completeEmail = createComponentPage(MHSBridge.default.auth.CompleteEmailForm, "completeEmail");

MyHomeworkSpace.Pages.resetPassword = createComponentPage(MHSBridge.default.auth.ResetPasswordForm, "resetPassword");

MyHomeworkSpace.Pages.createAccount = createComponentPage(MHSBridge.default.auth.CreateAccountForm, "createAccount");

MyHomeworkSpace.Pages.classes = createComponentPage(MHSBridge.default.pages.classes.ClassesPage, "classes");

MyHomeworkSpace.Pages.planner = createComponentPage(MHSBridge.default.pages.planner.PlannerPage, "planner");

MyHomeworkSpace.Pages.calendar = createComponentPage(MHSBridge.default.pages.calendar.CalendarPage, "calendar");

MyHomeworkSpace.Pages.settings = createComponentPage(MHSBridge.default.pages.settings.SettingsPage, "settings");

MyHomeworkSpace.Pages.help = createComponentPage(MHSBridge.default.pages.help.HelpPage, "help");

MyHomeworkSpace.Pages.admin = createComponentPage(MHSBridge.default.pages.admin.AdminPage, "admin");