import { h, Component } from "preact";

class HelpPage extends Component {
	render(props, state) {
		return (<div height="100%" style="height: calc(100vh - 100px);">
			<h2>Help</h2>
			<p class="lead">All support documentation is available at <a href="https://help.myhomework.space">help.myhomework.space</a>.</p>
			<iframe src="https://support.myhomework.space/embedded-search" name="" scrolling="yes" marginheight="0px" marginwidth="0px" allowfullscreen="" width="100%" height="100%" frameborder="0"></iframe>
		</div>)
	}
}

export default HelpPage;