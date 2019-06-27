MyHomeworkSpace.Pages.login = {
	init: function() {
		MHSBridge.default.render(MHSBridge.default.h(MHSBridge.default.auth.LoginForm, {
			openModal: MHSBridge.default.openModal,
			callback: function(data) {
				MyHomeworkSpace.Pages.login.handleLoginComplete(data);
			}
		}), null, document.querySelector("#login > div"));
	},
	handleLoginComplete: function(info) {
		MyHomeworkSpace.Classes.load(function() {
			MyHomeworkSpace.Prefixes.init(function() {
				MyHomeworkSpace.API.get("prefs/getAll", {}, function(prefsData) {
					MyHomeworkSpace.Pages.settings.cache = {};

					for (var prefIndex in prefsData.prefs) {
						var prefInfo = prefsData.prefs[prefIndex];
						var prefValue = prefInfo.value;
						if (prefValue == "true") {
							prefValue = true;
						} else if (prefValue == "false") {
							prefValue = false;
						}
						MyHomeworkSpace.Pages.settings.cache[prefInfo.key] = prefValue;
					}

					MHSBridge.default.quickAdd.init();

					MyHomeworkSpace.Nav.init();

					MyHomeworkSpace.Me = info.user;
					MyHomeworkSpace.Tabs = info.tabs;

					if (info.showMigrateMessage) {
						MHSBridge.default.openModal("accountMigrate", {});
						MyHomeworkSpace.API.post("auth/clearMigrateFlag", {}, function() {});
					}			

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

					var requestedPage = window.location.hash.substr(2);
					
					if (requestedPage && requestedPage != "login") {
						MyHomeworkSpace.Page.show(requestedPage);
					} else {
						MyHomeworkSpace.Page.show("homework");
					}
					$("#login").remove();
				});
			});
		});
	}
};
