MyHomeworkSpace.Feedback = {
	init: function() {
		$(".feedbackBtn").tooltip();
		$(".feedbackBtn").click(function() {
			var type = $(this).attr("data-type");
			var descs = {
				smile: "Found something you like? Let us know!",
				frown: "Found something that doesn't work like it should? Let us know!",
				idea: "Have an idea for an improvement or modification? Let us know!"
			};
			$("#feedbackModalDesc").text(descs[type]);
			$("#feedbackModalType").text((type == "idea" ? "n" : "") + " " + type);
			$("#feedbackModalText").val("");
			$("#feedbackModal").attr("data-type", type);
			$("#feedbackModal").modal();
		});
		$("#submitFeedbackModal").click(function() {
			if ($("#feedbackModalText").val().trim() == "") {
				alert("You must type in a message.");
				return;
			}
			$("#feedbackModal").modal("hide");
			$("#loadingModal").modal({
				backdrop: "static",
				keyboard: false
			});
			MyHomeworkSpace.API.post("feedback/add", {
				type: $("#feedbackModal").attr("data-type"),
				text: $("#feedbackModalText").val()
			}, function(response) {
				$("#loadingModal").modal("hide");
				alert("Thanks for the feedback!");
			});
		});
	}
};