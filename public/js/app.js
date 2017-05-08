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
	}
};

MyHomeworkSpace.Pages = {};

MyHomeworkSpace.Prefixes = {};
MyHomeworkSpace.Prefixes.list = [{
									color: "cal_hw",
									words: ["HW", "Read", "Reading"],
									tabSystem: true
								},
								{
									color: "cal_project",
									words: ["Project"],
									tabSystem: true
								},
								{
									color: "cal_paper",
									words: ["Report", "Essay", "Paper"],
									tabSystem: true
								},
								{
									color: "cal_quiz",
									words: ["Quiz"],
									tabSystem: true
								},
								{
									color: "cal_quiz",
									words: ["PopQuiz"],
									tabSystem: false
								},
								{
									color: "cal_test",
									words: ["Test", "Final", "Exam", "Midterm"],
									tabSystem: true
								},
								{
									color: "cal_ica",
									words: ["ICA"],
									tabSystem: true
								},
								{
									color: "cal_lab",
									words: ["Lab", "Study", "Memorize"],
									tabSystem: true
								},
								{
									color: "cal_docid",
									words: ["DocID"],
									tabSystem: true
								},
								{
									color: "cal_hex",
									words: ["Trojun", "Hex"],
									tabSystem: false
								},
								{
									color: "cal_no_hw",
									words: ["NoHW", "None"],
									tabSystem: true
								},
								{
									color: "cal_optional_hw",
									words: ["OptionalHW", "Challenge"],
									tabSystem: true
								},
								{
									color: "cal_prez",
									words: ["Presentation", "Prez"],
									tabSystem: true
								},
								{
									color: "cal_build",
									words: ["BuildSession", "Build"],
									tabSystem: true
								}];
MyHomeworkSpace.Prefixes.matchClass = function(prefix) {
	var chkPrefix = prefix.toLowerCase();
	for (var prefixIndex in MyHomeworkSpace.Prefixes.list) {
		for (var wordIndex in MyHomeworkSpace.Prefixes.list[prefixIndex].words) {
			if (MyHomeworkSpace.Prefixes.list[prefixIndex].words[wordIndex].toLowerCase() == chkPrefix) {
				return MyHomeworkSpace.Prefixes.list[prefixIndex].color;
			}
		}
	}
	return "cal_no_prefix";
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
		MHSBridge.default.render(MHSBridge.default.h(MHSBridge.default.ui.AddAction, {}), null, $(".addAction")[0]);
		
		$("#logout").click(function() {
			MyHomeworkSpace.API.get("auth/logout", {}, function(xhr) {
				window.location.reload();
			});
		});

		MyHomeworkSpace.Feedback.init();

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
