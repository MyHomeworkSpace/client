MyHomeworkSpace.Pages.login = {
	handleLoginComplete: function(context, targetPage, callback) {
		MyHomeworkSpace.Classes.initWithContext(context);
		MyHomeworkSpace.Prefixes.initWithContext(context);

		MyHomeworkSpace.Pages.settings.cache = {};

		for (var prefIndex in context.prefs) {
			var prefInfo = context.prefs[prefIndex];
			var prefValue = prefInfo.value;
			if (prefValue == "true") {
				prefValue = true;
			} else if (prefValue == "false") {
				prefValue = false;
			}
			MyHomeworkSpace.Pages.settings.cache[prefInfo.key] = prefValue;
		}

		MHSBridge.default.quickAdd.init(MyHomeworkSpace.Classes.list);

		MyHomeworkSpace.Nav.init();

		MyHomeworkSpace.Me = context.user;
		MyHomeworkSpace.Tabs = context.tabs;

		if (context.user.showMigrateMessage) {
			MHSBridge.default.openModal("accountMigrate", {});
			MyHomeworkSpace.API.post("auth/clearMigrateFlag", {}, function() {});
		}

		// clean existing server-side tabs
		var serverTabs = document.getElementsByClassName("serverTab");
		for (var i = 0; i < serverTabs.length; i++) {
			serverTabs[i].remove();
		}

		// add the server-side tabs
		for (var tabIndex in MyHomeworkSpace.Tabs) {
			var tab = MyHomeworkSpace.Tabs[tabIndex];
			var tabElement = document.createElement("div");
				tabElement.classList.add("page", "serverTab", "hidden");
				tabElement.id = tab.slug;
				tabElement.style.padding = "0";
				var frameElement = document.createElement("iframe");
					frameElement.seamless = true;
					frameElement.style.border = "none";
					frameElement.style.width = "100%";
					frameElement.style.height = "100%";
					frameElement.src = tab.target;
				tabElement.appendChild(frameElement);
			document.getElementById("app").appendChild(tabElement);
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
	},
	open: function(params) {
		MHSBridge.default.render(MHSBridge.default.h(MHSBridge.default.auth.LoginForm, {
			params: params,
			openModal: MHSBridge.default.openModal,
			callback: function(data, targetPage) {
				MyHomeworkSpace.Pages.login.handleLoginComplete(data, targetPage);
			}
		}), document.querySelector("#login"));
	}
};
