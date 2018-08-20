MyHomeworkSpace.Pages.login = {
	init: function() {
		MHSBridge.default.render(MHSBridge.default.h(MHSBridge.default.ui.LoginForm, {
			callback: function(data) {
				MyHomeworkSpace.Pages.login.handleLoginComplete(data);
			}
		}), document.querySelector("#loginContainer"));
	},
	handleLoginComplete: function(info) {
		MyHomeworkSpace.Classes.load(function() {
			MyHomeworkSpace.Prefixes.init(function() {
				MHSBridge.default.quickAdd.init();

				MyHomeworkSpace.Nav.init();
				
				MyHomeworkSpace.Pages.homework.onLogin();
				MyHomeworkSpace.Pages.settings.onLogin();

				MyHomeworkSpace.Me = info.user;
				MyHomeworkSpace.Me.grade = info.grade;
				MyHomeworkSpace.Tabs = info.tabs;

				// add the server-side tabs
				$(".serverTab").remove();
				for (var tabIndex in MyHomeworkSpace.Tabs) {
					var tab = MyHomeworkSpace.Tabs[tabIndex];
					var $tab = $('<div class="page serverTab hidden">');
						$tab.attr("id", tab.slug);
						$tab.css({
							padding: "0"
						});
						var $frame = $('<iframe seamless></iframe>');
							$frame.css({
								border: "none",
								width: "100%",
								height: "100%"
							});
							$frame.attr("src", tab.target);
						$tab.append($frame);
					$("body").append($tab);
				}
				
				if (window.location.hash.length > 1 && window.location.hash.substr(2) != "login") {
					MyHomeworkSpace.Page.show(window.location.hash.substr(2));
				} else {
					MyHomeworkSpace.Page.show("homework");
				}
				$("#login").remove();
				if (MyHomeworkSpace.Me.showMigrateMessage) {
					MyHomeworkSpace.API.post("auth/clearMigrateFlag", {}, function() {
						$("#migrationWelcome").modal();
					});
				}
			});
		});
	}
};
