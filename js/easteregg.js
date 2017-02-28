function loadclippy() {
    document.getElementById("clipify").style.display = 'none';
    clippy.load('Clippy', function (agent) {
        agent.play('Greeting');
        agent.speak('When all else fails, bind some paper together. My name is Clippy.');
        agent.show();
    })
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
            agent.speack("Your assignment has been deleted");
        })
}