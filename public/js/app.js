var MyHomeworkSpace = {};

MyHomeworkSpace.API = MHSBridge.default.api;

MyHomeworkSpace.Classes = {
	list: [],
	load: function(callback) {
		MyHomeworkSpace.API.get("classes/get", {}, function(data) {
			MyHomeworkSpace.Classes.list = data.classes;
			$("#homeworkClass").html("");
			$("#homeworkClass").append('<option value="-1">No class</option>');
			for (var classIndex in MyHomeworkSpace.Classes.list) {
				var classItem = MyHomeworkSpace.Classes.list[classIndex];
				var $option = $('<option></option>');
					$option.val(classItem.id);
					$option.text(classItem.name);
				$("#homeworkClass").append($option);
			}
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
	showSidebar: true,
	rerenderNav: function() {
		MHSBridge.default.render(MHSBridge.default.h(MHSBridge.default.ui.Sidebar, {
			me: MyHomeworkSpace.Me,
			tabs: MyHomeworkSpace.Tabs,
			page: MyHomeworkSpace.Page.current(),
			openModal: MHSBridge.default.openModal,
			openPage: MyHomeworkSpace.Page.show,
			inverted: MyHomeworkSpace.Nav.inverted,
			visible: MyHomeworkSpace.Nav.showSidebar
		}), null, $(".sidebar")[0]);
		MHSBridge.default.render(MHSBridge.default.h(MHSBridge.default.ui.TopBar, {
			me: MyHomeworkSpace.Me,
			tabs: MyHomeworkSpace.Tabs,
			page: MyHomeworkSpace.Page.current(),
			openModal: MHSBridge.default.openModal,
			openPage: MyHomeworkSpace.Page.show,
			inverted: MyHomeworkSpace.Nav.inverted,
			toggleSidebar: function() {
				MyHomeworkSpace.Nav.showSidebar = !MyHomeworkSpace.Nav.showSidebar;
				MyHomeworkSpace.Nav.rerenderNav();
			}
		}), null, $(".topBar")[0]);
		if (MyHomeworkSpace.Nav.showSidebar) {
			$(".page").removeClass("sidebarHiding");
			$(".page").addClass("sidebarVisible");
		} else {
			$(".page").removeClass("sidebarVisible");
			$(".page").addClass("sidebarHiding");
		}
	},
	init: function() {
		MyHomeworkSpace.API.get("prefs/get/background", {}, function(data) {
			if (data.status != "error") {
				var bgVal = data.pref.value;
				MHSBridge.default.background.setBackground(bgVal);
			}
		});
	}
};

MyHomeworkSpace.Page = {
	current: function() {
		return $(".page:not(.hidden)").attr("id");
	},
	show: function(path) {
		$(".page:not(.hidden)").addClass("hidden");
		$(".sidebarItem.selected").removeClass("selected");
		if (path) {
			var parts = path.split(":");
			var name = parts[0];
			var param = parts[1];
			var $page = $("#" + name);
			$page.removeClass("hidden");
			$(".sidebarItem[data-page=" + name + "]").addClass("selected");
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
		$(".sidebarItem").click(function() {
			if ($(".page:not(.hidden)").attr("id") == $(this).attr("data-page")) {
				// if it's already open, close the current page
				MyHomeworkSpace.Page.show("");
				return;
			}
			MyHomeworkSpace.Page.show($(this).attr("data-page"));
		});
		
		for (var pageIndex in MyHomeworkSpace.Pages) {
			if (MyHomeworkSpace.Pages[pageIndex].init) {
				MyHomeworkSpace.Pages[pageIndex].init();
			}
		}

		MyHomeworkSpace.API.get("auth/me", {}, function(data) {
			if (data.status == "ok") {
				MyHomeworkSpace.Pages.login.handleLoginComplete(data);
			} else {
				MyHomeworkSpace.Page.show("login");
			}
			$("#loadingStart").remove();
		});
	});
});
