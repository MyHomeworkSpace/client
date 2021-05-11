import { h, Component } from "preact";

import api from "api.js";

import LoadingIndicator from "ui/LoadingIndicator.jsx";

class TwoFactorInfo extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true
		};
	}

	componentDidMount() {
		api.get("auth/2fa/status", {}, (data) => {
			this.setState({
				loading: false,
				enrolledTOTP: data.enrolledTOTP,
				enrolledWebAuthn: data.enrolledWebAuthn
			});
		});
	}

	manage2fa() {
		this.props.openModal("twoFactor", {
			enrolled: this.state.enrolledTOTP
		});
	}

	manageWebAuthn() {
		this.props.openModal("webAuthn", {});
	}

	render(props, state) {
		const twofactorenabled = state.enrolledTOTP || state.enrolledWebAuthn;

		if (state.loading) {
			return <div class="twoFactorInfo">
				<LoadingIndicator /> Loading, please wait...
			</div>;
		}

		return <div class="twoFactorInfo">
			<p>
				It's currently <strong>{twofactorenabled ? "enabled" : "disabled"}</strong> on your account.
			</p>
			{(state.enrolledTOTP || state.enrolledWebAuthn) && <p>
				In addition to your password, you can log on to your account with a/an
				<ul>
					{state.enrolledTOTP && <li>Authenticator app</li>}
					{state.enrolledWebAuthn && <li>Security key</li>}
				</ul>
			</p>}
			<button class={`btn btn-${twofactorenabled ? "danger" : "primary"}`} onClick={this.manage2fa.bind(this)}><i class="fa fa-fw fa-lock" /> {twofactorenabled ? "Disable" : "Enable"} two-factor authentication</button>

			{state.enrolledTOTP && !state.enrolledWebAuthn && <button class="btn btn-primary" onClick={this.manageWebAuthn.bind(this)}><i class="fa fa-fw fa-key" /> Add a security key</button>
			}
		</div>;
	}
}

export default TwoFactorInfo;