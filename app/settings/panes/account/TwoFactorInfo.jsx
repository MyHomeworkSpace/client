import { h, Component } from "preact";

import api from "api.js";

import LoadingIndicator from "ui/LoadingIndicator.jsx";

class TwoFactorInfo extends Component {
	componentWillMount() {
		var that = this;

		this.setState({
			loading: true
		}, function() {
			api.get("auth/2fa/status", {}, function(data) {
				that.setState({
					loading: false,
					enrolled: data.enrolled
				});
			});
		});
	}

	manage2fa() {
		this.props.openModal("twoFactor", {
			enrolled: this.state.enrolled
		});
	}

	render(props, state) {
		if (state.loading) {
			return <div class="twoFactorInfo">
				<LoadingIndicator /> Loading, please wait...
			</div>;
		}

		return <div class="twoFactorInfo">
			<p>
				It's currently <strong>{state.enrolled ? "enabled" : "disabled"}</strong> on your account.
			</p>
			<button class={`btn btn-${state.enrolled ? "danger" : "primary"}`} onClick={this.manage2fa.bind(this)}><i class="fa fa-fw fa-lock" /> {state.enrolled ? "Disable" : "Enable"} two-factor authentication</button>
		</div>;
	}
}

export default TwoFactorInfo;