var MyHomeworkSpace = {};

MyHomeworkSpace.API = MHSBridge.default.api;

MyHomeworkSpace.Classes = {
	list: [],
	load: function(callback) {
		MyHomeworkSpace.API.get("classes/get", {}, function(data) {
			MyHomeworkSpace.Classes.list = data.classes;
			callback();
		});
	},
	reload: function() {
		MHSBridge.default.quickAdd.init();
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
			dimmed: MHSBridge.default.background.isDimBackground()
		}), null, $(".topBar")[0]);
	},
	init: function() {
		if (MyHomeworkSpace.Pages.settings.cache.background) {
			MHSBridge.default.background.setBackground(MyHomeworkSpace.Pages.settings.cache.background);
		}
	}
};

MyHomeworkSpace.Page = {
	current: function() {
		return $(".page:not(.hidden)").attr("id");
	},
	show: function(path) {
		$(".page:not(.hidden)").addClass("hidden");
		if (path) {
			var parts = path.split(":");
			var name = parts[0];
			var param = parts[1];
			var $page = $("#" + name);
			$page.removeClass("hidden");
			window.location.hash = "!" + name + (param ? ":" + param : "");
			if (MyHomeworkSpace.Pages[name] && MyHomeworkSpace.Pages[name].open) {
				MyHomeworkSpace.Pages[name].open(param);
			}
			if ($page.hasClass("serverTab")) {
				var tab;
				for (var tabIndex in MyHomeworkSpace.Tabs) {
					if (MyHomeworkSpace.Tabs[tabIndex].slug == name) {
						tab = MyHomeworkSpace.Tabs[tabIndex];
					}
				}
				var src = $page.children("iframe").attr("src");
				src = tab.target + "#" + (param || "");
				$page.children("iframe").attr("src", src);
			}
		}
		MyHomeworkSpace.Nav.rerenderNav();
	}
};

MyHomeworkSpace.Pages = {};

MyHomeworkSpace.Prefixes = MHSBridge.default.prefixes;

$(document).ready(function() {
	if (window.location.href.indexOf("applicationAuth") > -1) {
		// we're actually on the application auth page, so don't run this code
		// we're just here for the api object
		return;
	}
	MyHomeworkSpace.API.init(function() {
		for (var pageIndex in MyHomeworkSpace.Pages) {
			if (MyHomeworkSpace.Pages[pageIndex].init) {
				MyHomeworkSpace.Pages[pageIndex].init();
			}
		}

		MyHomeworkSpace.API.get("auth/me", {}, function(data) {
			if (data.status == "ok") {
				MyHomeworkSpace.Pages.login.handleLoginComplete(data);
			} else {
				var openPage = (window.location.hash == "#!createAccount" ? "createAccount" : "login");
				MyHomeworkSpace.Page.show(openPage);
			}
			$("#loadingStart").remove();
		});
	});
});
