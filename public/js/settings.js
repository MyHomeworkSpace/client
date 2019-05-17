MyHomeworkSpace.Pages.settings = {
	cache: {},
	hackyBackgroundColorTimeout: undefined,
	init: function() {

	},
	onLogin: function() {
		$(".settings_checkbox").each(function() {
			var pref = $(this).attr("data-pref");
			if (MyHomeworkSpace.Pages.settings.cache[pref]) {
				$(this).prop("checked", MyHomeworkSpace.Pages.settings.cache[pref]);
			}
		});
		$(".settings_checkbox").change(function() {
			var newVal = $(this).prop("checked");
			if ($(this).attr("data-pref-inverted") && $(this).attr("data-pref-inverted") == "true") {
				newVal = !newVal;
			}
			MyHomeworkSpace.Pages.settings.cache[$(this).attr("data-pref")] = newVal;
			MyHomeworkSpace.API.post("prefs/set", {
				key: $(this).attr("data-pref"),
				value: newVal
			}, function(data) {

			});
		});
		$("#settings_change_background").click(function() {
			MHSBridge.default.openModal("background");
		});

		MHSBridge.default.render(MHSBridge.default.h(MHSBridge.default.pages.settings.TwoFactorInfo, {
			openModal: MHSBridge.default.openModal
		}), null, $("#settingsTwoFactor > div")[0]);

		// applications
		$("a[href=\\#settings_applications]").on("show.bs.tab", function() {
			MHSBridge.default.render(MHSBridge.default.h(MHSBridge.default.pages.settings.ApplicationList, {}), null, $("#settingsApplicationsList > div")[0]);
		});

		// homework
		$("a[href=\\#settings_homework]").on("show.bs.tab", function() {
			MHSBridge.default.render(MHSBridge.default.h(MHSBridge.default.pages.settings.HomeworkSettings, {
				classes: MyHomeworkSpace.Classes.list
			}), null, $("#settingsHomeworkContainer > div")[0]);
		});

		// calendar
		$("a[href=\\#settings_calendar]").on("show.bs.tab", function() {
			MHSBridge.default.render(MHSBridge.default.h(MHSBridge.default.pages.settings.CalendarSettings, {}), null, $("#settingsCalendarContainer > div")[0]);
		});
	},
	open: function() {
		$("#settings_account_name").text(MyHomeworkSpace.Me.name);
		$("#settings_account_email").text(MyHomeworkSpace.Me.email);
		var displayGrade = MyHomeworkSpace.Me.grade + "th grade";
		if (MyHomeworkSpace.Me.grade > 12) {
			displayGrade = "Faculty member";
		}
		$("#settings_account_grade").text(displayGrade);
	}
};