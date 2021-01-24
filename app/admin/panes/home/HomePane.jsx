import "settings/panes/account/AccountPane.styl";

import { h, Component } from "preact";

import api from "api.js";
import errors from "errors.js";

import LoadingIndicator from "ui/LoadingIndicator.jsx";

export default class HomePane extends Component {
	render(props, state) {
		return <div class="homePane">
			<p>This is the MyHomeworkSpace admin panel.</p>
			<p>Just a friendly reminder to respect the <a href="https://support.myhomework.space/legal/privacy">Privacy Policy</a> when accessing data here.</p>
		</div >;
	}
};