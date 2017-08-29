var MyHomeworkSpace = {};

MyHomeworkSpace.API = MHSBridge.default.api;

MyHomeworkSpace.Classes = {
	list: [],
	load: function(callback) {
		MyHomeworkSpace.API.get("classes/get", {}, function(xhr) {
			MyHomeworkSpace.Classes.list = xhr.responseJSON.classes;
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
		MyHomeworkSpace.QuickAdd.init();
	}
};

MyHomeworkSpace.Me = {}; // will store the current user when logged in

MyHomeworkSpace.Nav = {
	inverted: false,
	showSidebar: true,
	rerenderNav: function() {
		MHSBridge.default.render(MHSBridge.default.h(MHSBridge.default.ui.Sidebar, {
			me: MyHomeworkSpace.Me,
			page: MyHomeworkSpace.Page.current(),
			openModal: MHSBridge.default.openModal,
			openPage: MyHomeworkSpace.Page.show,
			inverted: MyHomeworkSpace.Nav.inverted,
			visible: MyHomeworkSpace.Nav.showSidebar
		}), null, $(".sidebar")[0]);
		MHSBridge.default.render(MHSBridge.default.h(MHSBridge.default.ui.TopBar, {
			me: MyHomeworkSpace.Me,
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
		MyHomeworkSpace.API.get("prefs/get/background", {}, function(xhr) {
			if (xhr.responseJSON.status != "error") {
				var bgVal = xhr.responseJSON.pref.value;
				MHSBridge.default.background.setBackground(bgVal);
			}
		});
	}
};

MyHomeworkSpace.Page = {
	current: function() {
		return $(".page:not(.hidden)").attr("id");
	},
	show: function(name) {
		$(".page:not(.hidden)").addClass("hidden");
		$(".sidebarItem.selected").removeClass("selected");
		if (name) {
			$("#" + name).removeClass("hidden");
			$(".sidebarItem[data-page=" + name + "]").addClass("selected");
			window.location.hash = "!" + name;
			if (MyHomeworkSpace.Pages[name] && MyHomeworkSpace.Pages[name].open) {
				MyHomeworkSpace.Pages[name].open();
			}
		}
		MyHomeworkSpace.Nav.rerenderNav();
	}
};

MyHomeworkSpace.Pages = {};

MyHomeworkSpace.Prefixes = {};
MyHomeworkSpace.Prefixes.fallback = {
	background: "#FFD3BD",
	color: "#000000"
};
MyHomeworkSpace.Prefixes.list = [{
									background: "#4c6c9b",
									color: "#FFFFFF",
									words: ["HW", "Read", "Reading"],
									tabSystem: true
								},
								{
									background: "#9ACD32",
									color: "#FFFFFF",
									words: ["Project"],
									tabSystem: true
								},
								{
									background: "#FFD700",
									color: "#FFFFFF",
									words: ["Report", "Essay", "Paper"],
									tabSystem: true
								},
								{
									background: "#ffa500",
									color: "#FFFFFF",
									words: ["Quiz"],
									tabSystem: true
								},
								{
									background: "#ffa500",
									color: "#FFFFFF",
									words: ["PopQuiz"],
									tabSystem: false
								},
								{
									background: "#DC143C",
									color: "#FFFFFF",
									words: ["Test", "Final", "Exam", "Midterm"],
									tabSystem: true
								},
								{
									background: "#2ac0f1",
									color: "#FFFFFF",
									words: ["ICA"],
									tabSystem: true
								},
								{
									background: "#2af15e",
									color: "#FFFFFF",
									words: ["Lab", "Study", "Memorize"],
									tabSystem: true
								},
								{
									background: "#003DAD",
									color: "#FFFFFF",
									words: ["DocID"],
									tabSystem: true
								},
								{
									background: "#000000",
									color: "#00FF00",
									words: ["Trojun", "Hex"],
									tabSystem: false
								},
								{
									background: "#fcf8e3",
									color: "#000000",
									words: ["NoHW", "None"],
									tabSystem: true
								},
								{
									background: "#5000BC",
									color: "#FFFFFF",
									words: ["OptionalHW", "Challenge"],
									tabSystem: true
								},
								{
									background: "#000099",
									color: "#FFFFFF",
									words: ["Presentation", "Prez"],
									tabSystem: true
								},
								{
									background: "#123456",
									color: "#FFFFFF",
									words: ["BuildSession", "Build"],
									tabSystem: true
								}];
MyHomeworkSpace.Prefixes.matchPrefix = function(prefix) {
	var chkPrefix = prefix.toLowerCase();
	for (var prefixIndex in MyHomeworkSpace.Prefixes.list) {
		for (var wordIndex in MyHomeworkSpace.Prefixes.list[prefixIndex].words) {
			if (MyHomeworkSpace.Prefixes.list[prefixIndex].words[wordIndex].toLowerCase() == chkPrefix) {
				return MyHomeworkSpace.Prefixes.list[prefixIndex];
			}
		}
	}
	return MyHomeworkSpace.Prefixes.fallback;
};

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

		MyHomeworkSpace.API.get("auth/me", {}, function(xhr) {
			if (xhr.responseJSON.status == "ok") {
				MyHomeworkSpace.Pages.login.handleLoginComplete(xhr.responseJSON);
			} else {
				MyHomeworkSpace.Page.show("login");
			}
			$("#loadingStart").remove();
		});
	});
});
