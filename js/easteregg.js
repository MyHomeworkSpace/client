function loadclippy() {
    document.getElementById("clipify").style.display = 'none';
    clippy.load('Clippy', function (agent) {
        agent.play('Greeting');
        agent.speak('When all else fails, bind some paper together. My name is Clippy.');
        agent.show();
        document.getElementById("addHWBtn").addEventListener("click", function () {
            agent.speak("Type your assignment here.");
            agent.play('Writing');
        });
        document.getElementById("submitHomeworkModal").addEventListener("click", function () {
            agent.play('Save');
            agent.speak("Assignment Added");
        });
        document.getElementById("settings_change_background").addEventListener("click", function () {
            agent.play('GetArtsy');
        });
        document.getElementById("submitFeedbackModal").addEventListener("click", function () {
            agent.play('SendMail');
            agent.speak("Your feedback has been sent.");
        });
        document.getElementById("deleteHomeworkModal").addEventListener("click", function () {
            agent.play('EmptyTrash');
            agent.speak("Your assignment has been deleted");
        })
        document.getElementById("feedbackSmile").addEventListener("click", function() {
            agent.play("Congratulate");
            agent.speak("I'm glad you're happy with MyHomeworkSpace! Use this form to tell us what you like.");
        })
        document.getElementById("feedbackFrown").addEventListener("click", function () {
            agent.play("GetAttention");
            agent.speak("I'm sorry if you are encountering issues. Use this form to tell us what you don't like.");
        });
        document.getElementById("feedbackIdea").addEventListener("click", function () {
            agent.play("GetTechy");
            agent.speak("Have an idea for a feature? Use this form to tell us what you want to see next.");
        });
        document.getElementsByClassName("sidebarItem").addEventListener("click", function () {
            agent.animate();
        });
    })
}