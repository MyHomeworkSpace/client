import { h, Component } from "preact";

class HelpPage extends Component {
	render(props, state) {
		return <div height="100%" style="height: calc(100vh - 100px);">
			<h2>Help</h2>
			<p class="lead">All support documentation is available at <a href="https://help.myhomework.space">help.myhomework.space</a>.</p>
			<iframe src="https://support.myhomework.space/embedded-search" name="" scrolling="yes" marginHeight="0px" marginWidth="0px" allowFullScreen="" width="100%" height="100%" frameBorder="0"></iframe>
		</div>;
	}
}

export default HelpPage;