import "settings/panes/more/MorePane.styl";

import { h, Component } from "preact";

export default class MorePane extends Component {
	render(props, state) {
		return <div class="morePane">
			<h3>DaltonTab</h3>
			<p>
				<strong>Extension for Mozilla Firefox and Google Chrome</strong>
			</p>
			<p>DaltonTab is your home base for homework, classes, and your schedule. View your information from multiple sites in one central view, available at the click of a new tab.</p>
			<a href="https://addons.mozilla.org/en-US/firefox/addon/daltontab/" class="btn btn-primary" target="_blank" rel="noopener noreferrer"><i class="fa fa-fw fa-firefox" /> Download for Firefox</a>
			<a href="https://chrome.google.com/webstore/detail/daltontab/ggfjkmflbbjndabmnngilkfpmdegbfkm" class="btn btn-primary" target="_blank" rel="noopener noreferrer"><i class="fa fa-fw fa-chrome" /> Download for Chrome</a>

			<h3>MyHomeworkSpace Button</h3>
			<p>
				<strong>Extension for Google Chrome</strong>
			</p>
			<p>A button in your toolbar that leads directly to MyHomeworkSpace.</p>
			<a href="https://chrome.google.com/webstore/detail/myhomeworkspace-button/bgjhpfdlpnddingdjkjlefefbjdnnndm" class="btn btn-primary" target="_blank" rel="noopener noreferrer"><i class="fa fa-fw fa-chrome" /> Download for Chrome</a>

			<h3>Back to Drive</h3>
			<p>
				<strong>Extension for Google Chrome</strong>
			</p>
			<p>A nifty little extension that changes the link on the Docs, Spreadsheets, Slides, Drawings and Forms logo back to Drive.</p>
			<a href="https://chrome.google.com/webstore/detail/back-to-drive/nkamccjapcjemblidlcaipacjgkmpgkp" class="btn btn-primary" target="_blank" rel="noopener noreferrer"><i class="fa fa-fw fa-chrome" /> Download for Chrome</a>
		</div>;
	}
};