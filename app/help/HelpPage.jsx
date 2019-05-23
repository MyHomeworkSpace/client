import "help/HelpPage.styl";

import { h, Component } from "preact";

export default class HelpPage extends Component {
	render(props, state) {
		return <div class="helpPageContainer">
			<div>
				<h2>Help</h2>
				<p class="lead">All support documentation is available at <a href="https://help.myhomework.space">help.myhomework.space</a>.</p>
			</div>
			<iframe src="https://support.myhomework.space/embedded-search" name="" scrolling="auto" marginHeight="0px" marginWidth="0px" allowFullScreen="" width="100%" frameBorder="0"></iframe>
		</div>;
	}
};