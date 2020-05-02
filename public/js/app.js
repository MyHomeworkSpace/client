// polyfill for Object.assign on older browsers
// source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
if (typeof Object.assign !== 'function') {
	// Must be writable: true, enumerable: false, configurable: true
	Object.defineProperty(Object, "assign", {
		value: function assign(target, varArgs) { // .length of function is 2
			'use strict';
			if (target === null || target === undefined) {
				throw new TypeError('Cannot convert undefined or null to object');
			}

			var to = Object(target);

			for (var index = 1; index < arguments.length; index++) {
				var nextSource = arguments[index];

				if (nextSource !== null && nextSource !== undefined) {
					for (var nextKey in nextSource) {
						// Avoid bugs when hasOwnProperty is shadowed
						if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
							to[nextKey] = nextSource[nextKey];
						}
					}
				}
			}
			return to;
		},
		writable: true,
		configurable: true
	});
}

var MyHomeworkSpace = {};

MyHomeworkSpace.API = MHSBridge.default.api;

MyHomeworkSpace.Classes = {
	list: [],
	initWithContext: function(context) {
		MyHomeworkSpace.Classes.list = context.classes;
	}
};

MyHomeworkSpace.Me = {}; // will store the current user when logged in
MyHomeworkSpace.Tabs = null; // will store the current user's tabs when logged in

MyHomeworkSpace.Nav = {
	inverted: false,
	rerenderNav: function() {
		MHSBridge.default.render(MHSBridge.default.h(MHSBridge.default.ui.TopBar, {
			me: MyHomeworkSpace.Me,
			tabs: MyHomeworkSpace.Tabs,
			page: MyHomeworkSpace.Page.current(),
			openModal: MHSBridge.default.openModal,
			openPage: MyHomeworkSpace.Page.show,
			inverted: MyHomeworkSpace.Nav.inverted,
			dimmed: MHSBridge.default.background.isDimBackground(),
			currentBackground: MHSBridge.default.background.currentBackground(),
			daltonTabBackgroundDetails: MHSBridge.default.background.daltonTabBackgroundDetails(),
		}), document.querySelector(".topBar"));
	},
	init: function() {
		if (MyHomeworkSpace.Pages.settings.cache.background) {
			MHSBridge.default.background.setBackground(MyHomeworkSpace.Pages.settings.cache.background);
		}

		MHSBridge.default.background.setDarkTheme(MyHomeworkSpace.Pages.settings.cache.darkTheme || false);
	}
};

MyHomeworkSpace.Page = {
	noLogin: ["login", "createAccount", "completeEmail", "resetPassword"],
	init: function() {
		window.addEventListener("hashchange", function(e) {
			var requestedPage = window.location.hash.substr(2);
			var requestedPageParts = requestedPage.split(":");
			if (MyHomeworkSpace.Page.current() != requestedPageParts[0]) {
				MyHomeworkSpace.Page.show(requestedPage);
			}
		});
	},
	current: function() {
		var pageElement = document.querySelector(".page:not(.hidden)");
		return (pageElement ? pageElement.id : "");
	},
	show: function(path) {
		if (MyHomeworkSpace.Page.current() != "") {
			document.querySelector(".page:not(.hidden)").classList.add("hidden");
		}
		if (path) {
			var parts = path.split(":");
			var name = parts[0];
			var params = [].concat(parts);
			params.splice(0, 1);

			var pageElement = document.getElementById(name);
			pageElement.classList.remove("hidden");

			var newHash = "!" + name + (params.length > 0 ? ":" + params.join(":") : "");
			if (window.location.hash) {
				// already on a page, add a history entry
				window.location.hash = newHash;
			} else {
				// overwrite the existing entry
				window.location.replace("#" + newHash);
			}
			if (MyHomeworkSpace.Pages[name] && MyHomeworkSpace.Pages[name].open) {
				MyHomeworkSpace.Pages[name].open(params);
			}
			if (pageElement.classList.contains("serverTab")) {
				var tab;
				for (var tabIndex in MyHomeworkSpace.Tabs) {
					if (MyHomeworkSpace.Tabs[tabIndex].slug == name) {
						tab = MyHomeworkSpace.Tabs[tabIndex];
					}
				}

				var src = tab.target + "#" + (params.join(":") || "");
				pageElement.getElementsByTagName("iframe")[0].src = src;
			}
		}
		MyHomeworkSpace.Nav.rerenderNav();
	}
};

MyHomeworkSpace.Pages = {};

MyHomeworkSpace.Prefixes = MHSBridge.default.prefixes;

window.addEventListener("load", function() {
	MyHomeworkSpace.Page.init();
	MyHomeworkSpace.API.init(function() {
		for (var pageIndex in MyHomeworkSpace.Pages) {
			if (MyHomeworkSpace.Pages[pageIndex].init) {
				MyHomeworkSpace.Pages[pageIndex].init();
			}
		}

		MyHomeworkSpace.API.get("auth/context", {}, function(data) {
			if (data.status == "ok") {
				MyHomeworkSpace.Pages.login.handleLoginComplete(data);
			} else {
				var requestedPage = window.location.hash.substr(2);
				var requestedPageName = requestedPage.split(":")[0];
				var pageToOpen = "login";
				if (MyHomeworkSpace.Page.noLogin.indexOf(requestedPageName) > -1) {
					pageToOpen = requestedPage;
				} else if (requestedPage) {
					// tell the login page to redirect
					pageToOpen = "login:" + requestedPage;
				}
				MyHomeworkSpace.Page.show(pageToOpen);
			}
		});
	});
});
