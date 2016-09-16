MyHomeworkSpace.Pages.login = {
	init: function() {
		var loginError = function(errorMessage) {
			$("#loginError").text(errorMessage).fadeOut(100).fadeIn(100);
			$("#loginForm").effect("shake");
		};
		$("#loginSubmit").click(function() {
			$("#loginUsername").prop("disabled", true);
			$("#loginPassword").prop("disabled", true);
			$("#loginSubmit").html('<i class="fa fa-refresh fa-spin"></i>');
			MyHomeworkSpace.API.post("auth/login", {
				username: $("#loginUsername").val(),
				password: $("#loginPassword").val()
			}, function(response) {
				if (response.responseJSON.status != "ok") {
					$("#loginUsername").prop("disabled", false);
					$("#loginPassword").prop("disabled", false);
					$("#loginSubmit").text("Log in");
					loginError(response.responseJSON.error);
					return;
				}
				$("#loginUsername").prop("disabled", false);
				$("#loginPassword").prop("disabled", false);
				$("#loginSubmit").text("Log in");
				MyHomeworkSpace.API.get("auth/me", {}, function(xhr) {
					if (xhr.responseJSON.status == "ok") {
						MyHomeworkSpace.Pages.login.handleLoginComplete(xhr.responseJSON);
					} else {
						loginError("Something weird happened, try again?");
					}
				});
			});
		});
	},
	handleLoginComplete: function(info) {
		MyHomeworkSpace.Classes.load(function() {
			MyHomeworkSpace.QuickAdd.init();

			MyHomeworkSpace.Me = info;
			$("#topName").text(info.name);
			if ($("#" + window.location.hash.substr(2)).length > 0 && window.location.hash.substr(2) != "login") {
				MyHomeworkSpace.Page.show(window.location.hash.substr(2));
			} else {
				MyHomeworkSpace.Page.show("homework");
			}
			$("#login").effect("drop", { direction: "up" });
			if (MyHomeworkSpace.Me.showMigrateMessage) {
				MyHomeworkSpace.API.post("auth/clearMigrateFlag", {}, function() {

				});
			}
		});
	}
};
