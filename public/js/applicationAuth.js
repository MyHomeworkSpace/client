var currentApplication;

var getApplicationID = function() {
	return unescape(window.location.href.match("\\?id=(.*?)(&|$)") ? window.location.href.match("\\?id=(.*?)(&|$)")[1] : "");
};

var getState = function() {
	return (window.location.href.match("&state=(.*)") ? window.location.href.match("&state=(.*)")[1] : "");
};

var afterLogin = function(info) {
	MyHomeworkSpace.Me = info;

	$(".applicationAuthLogin").addClass("hidden");
	$(".applicationAuthLoadingOverlay").addClass("hidden");
	$(".applicationAuthLoginInfo").removeClass("hidden");
	$(".applicationAuthUser").text(MyHomeworkSpace.Me.name);
	$(".applicationAuthFirstName").text(MyHomeworkSpace.Me.name.split(" ")[0]);
	MyHomeworkSpace.API.get("application/get/" + getApplicationID(), {}, function(data) {
		if (data.status == "ok") {
			$(".applicationAuthRequest").removeClass("hidden");
			currentApplication = data.application;
			$(".applicationAuthName").text(currentApplication.name);
			$(".applicationAuthAuthor").text(currentApplication.authorName);
			if (currentApplication.authorName.trim() == "") {
				$(".applicationAuthAuthorLabel").text("");
			}
		} else {
			$(".applicationAuthErrorMessage").text("Could not get application for authentication request. Try again later.");
			$(".applicationAuthError").removeClass("hidden");
		}
	});
};

$(document).ready(function() {
	MyHomeworkSpace.API.init(function() {
		MyHomeworkSpace.API.get("auth/me", {}, function(data) {
			if (data.status == "ok") {
				afterLogin(data);
			} else {
				$(".applicationAuthLogin").removeClass("hidden");
			}
			$(".applicationAuthLoadingOverlay").addClass("hidden");
		});
	});

	MHSBridge.default.render(MHSBridge.default.h(MHSBridge.default.ui.LoginForm, {
		callback: function(data) {
			afterLogin(data);
		},
		bootstrap4: true
	}), document.querySelector("#loginContainer"));

	$("#applicationAuthAllow").click(function() {
		$(".applicationAuthLoadingOverlay").removeClass("hidden");
		MyHomeworkSpace.API.post("application/completeAuth", {
			clientId: getApplicationID()
		}, function(data) {
			if (data.status == "ok") {
				window.location.href = currentApplication.callbackUrl + "?token=" + escape(data.token) + "&state=" + getState();
			} else {
				$(".applicationAuthLoadingOverlay").addClass("hidden");
				$(".applicationAuthRequest").addClass("hidden");
				$(".applicationAuthErrorMessage").text("Could not complete authentication request. Try again later.");
				$(".applicationAuthError").removeClass("hidden");
			}
		});
	});

	$("#applicationAuthDeny").click(function() {
		window.location.pathname = "";
	});

	$(".applicationAuthLogout").click(function(event) {
		event.preventDefault();
		$(".applicationAuthLoadingOverlay").removeClass("hidden");
		MyHomeworkSpace.API.get("auth/logout", {}, function(data) {
			window.location.reload();
		});
	});
});