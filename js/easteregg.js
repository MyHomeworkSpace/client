function loadclippy() {
	clippy.load('Clippy', function(agent){
        agent.play('Greeting');
        agent.speak('When all else fails, bind some paper together. My name is Clippy.');
        agent.show();
	})
}l