import "settings/panes/AccountPane.styl";

import { h, Component } from "preact";

import TwoFactorInfo from "settings/TwoFactorInfo.jsx";

export default class AccountPane extends Component {
	changeBackground() {
		this.props.openModal("background", {});
	}

	render(props, state) {
		return <div class="accountPane">
			<h3>{props.me.name}</h3>
			<h4>{props.me.email}</h4>

			<br />

			<h4>Password</h4>
			<p>You're signed in with your Dalton account. For assistance with Dalton accounts, please contact <a href="mailto:help@dalton.org">help@dalton.org</a>.</p>
			<a href="https://password.dalton.org" class="btn btn-primary">Change password</a>

			<br />
			<br />

			<TwoFactorInfo openModal={props.openModal} />

			<br />

			<h4>Background</h4>
			<button class="btn btn-primary" onClick={this.changeBackground.bind(this)}>Change background</button>
		</div>;
	}
};