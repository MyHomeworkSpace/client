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
	MyHomeworkSpace.API.get("application/get/" + getApplicationID(), {}, function(xhr) {
		if (xhr.responseJSON.status == "ok") {
			$(".applicationAuthRequest").removeClass("hidden");
			currentApplication = xhr.responseJSON.application;
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
	MyHomeworkSpace.Pages.login.init(true, afterLogin);
	MyHomeworkSpace.API.init(function() {
		MyHomeworkSpace.API.get("auth/me", {}, function(xhr) {
			if (xhr.responseJSON.status == "ok") {
				afterLogin(xhr.responseJSON);
			} else {
				$(".applicationAuthLogin").removeClass("hidden");
			}
			$(".applicationAuthLoadingOverlay").addClass("hidden");
		});
	});

	$("#applicationAuthAllow").click(function() {
		$(".applicationAuthLoadingOverlay").removeClass("hidden");
		MyHomeworkSpace.API.post("application/completeAuth", {
			clientId: getApplicationID()
		}, function(xhr) {
			if (xhr.responseJSON.status == "ok") {
				window.location.href = currentApplication.callbackUrl + "?token=" + escape(xhr.responseJSON.token) + "&state=" + getState();
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

	$("#applicationAuthLogout").click(function() {
		$(".applicationAuthLoadingOverlay").removeClass("hidden");
		MyHomeworkSpace.API.get("auth/logout", {}, function(xhr) {
			window.location.reload();
		});
	});
});