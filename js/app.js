var MyHomeworkSpace = {};

MyHomeworkSpace.API = {
	baseURL: window.location.protocol + "//api-v2." + window.location.hostname + "/",
	token: "",
	get: function(path, data, callback) {
		return MyHomeworkSpace.API.request(path, "GET", data, callback);
	},
	post: function(path, data, callback) {
		return MyHomeworkSpace.API.request(path, "POST", data, callback);
	},
	init: function(callback) {
		MyHomeworkSpace.API.rawRequest("auth/csrf", "GET", {}, function(xhr) {
			MyHomeworkSpace.API.rawRequest("auth/csrf", "GET", {}, function(xhr) {
				MyHomeworkSpace.API.token = xhr.responseJSON.token;
				callback();
			});
		});
	},
	rawRequest: function(path, method, data, callback) {
		$.ajax({
			crossDomain: true,
			data: data,
			method: method,
			url: MyHomeworkSpace.API.baseURL + path,
			xhrFields: {
				withCredentials: true
			},
			complete: function(jqXHR) {
				callback(jqXHR);
			}
		});
	},
	request: function(path, method, data, callback) {
		return MyHomeworkSpace.API.rawRequest(path + "?csrfToken=" + encodeURIComponent(MyHomeworkSpace.API.token), method, data, callback);
	}
};

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
	MyHomeworkSpace.API.init(function() {
		$(".sidebarItem").click(function() {
			if ($(".page:not(.hidden)").attr("id") == $(this).attr("data-page")) {
				// if it's already open, close the current page
				MyHomeworkSpace.Page.show("");
				return;
			}
			MyHomeworkSpace.Page.show($(this).attr("data-page"));
		});
		$("#addHWBtn").click(function() {
			$("#addHWBtn").fadeOut(100, function() {
				$("#addHWBtn").addClass("hidden");
			});
			$("#addHWText").fadeIn(100).removeClass("hidden");
			$("#addHWInput").val("").focus().keyup();
		});
		$("#addHWClose").click(function() {
			$("#addHWText").fadeOut(100, function() {
				$("#addHWText").addClass("hidden");
			});
			$("#addHWBtn").fadeIn(100).removeClass("hidden");
		});
		$("#addHWInput").keyup(function(e) {
			var info = MyHomeworkSpace.QuickAdd.parseText($(this).val());
			$("#addHWTag").text(info.tag);
			$("#addHWTag").attr("class", "");
			$("#addHWTag").addClass(MyHomeworkSpace.Prefixes.matchClass(info.tag));
			$("#addHWRemain").text((info.name ? " " + info.name : ""));
			$("#addHWClass").text((info.class ? info.class : "unknown"));
			$("#addHWDue").text((info.due ? info.due : "unknown"));
			if (e.keyCode == 13) {
				if (info.tag || info.name) {
					$("#homeworkName").val(info.tag + " " + info.name);
				} else {
					$("#homeworkName").val("");					
				}
				$("#homeworkClass").val((info.classId ? info.classId : -1));
				$("#homeworkDue").val(MyHomeworkSpace.QuickAdd.parseDate(info.due));
				$("#homeworkComplete").prop("checked", false);
				$("#homeworkDesc").val("");
				$("#deleteHomeworkModal").hide();
				$("#homeworkModalType").text("Add");
				$("#homeworkModal").attr("data-actionType", "add");
				$("#homeworkName").trigger("input"); // trigger tag system
				$("#homeworkModal").modal();
				$("#addHWClose").click();
			}
		});
		$("#addHWInput").focus(function() {
			$("#addHWInfo").fadeIn(100);
		});
		$("#addHWInput").blur(function() {
			$("#addHWInfo").fadeOut(100);
		});
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
