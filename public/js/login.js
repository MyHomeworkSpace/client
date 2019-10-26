MyHomeworkSpace.Pages.login = {
	handleLoginComplete: function(info, targetPage, callback) {
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
						$("#app").append($tab);
					}

					var requestedPage = targetPage || window.location.hash.substr(2);

					if (requestedPage.indexOf("login:") == 0) {
						MyHomeworkSpace.Page.show(requestedPage.replace("login:", ""));
					} else if (requestedPage && requestedPage != "login") {
						MyHomeworkSpace.Page.show(requestedPage);
					} else {
						MyHomeworkSpace.Page.show("homework");
					}

					if (callback) {
						callback();
					}
				});
			});
		});
	},
	open: function(params) {
		MHSBridge.default.render(MHSBridge.default.h(MHSBridge.default.auth.LoginForm, {
			params: params,
			openModal: MHSBridge.default.openModal,
			callback: function(data, targetPage) {
				MyHomeworkSpace.Pages.login.handleLoginComplete(data, targetPage);
			}
		}), null, document.querySelector("#login > div"));
	}
};
