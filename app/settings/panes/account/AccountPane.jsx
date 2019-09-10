import "settings/panes/account/AccountPane.styl";

import { h, Component } from "preact";

import api from "api.js";
import errors from "errors.js";

import SchoolList from "settings/panes/account/SchoolList.jsx";
import TwoFactorInfo from "settings/panes/account/TwoFactorInfo.jsx";

import LoadingIndicator from "ui/LoadingIndicator.jsx";

export default class AccountPane extends Component {
	changeBackground() {
		this.props.openModal("background", {});
	}

	changeEmail() {
		this.props.openModal("changeEmail", {});
	}

	changePassword() {
		this.props.openModal("changePassword", {});
	}

	connectAccount() {
		this.props.openModal("enroll", {});
	}

	resendVerificationEmail() {
		var that = this;

		this.setState({
			resendLoading: true
		}, function() {
			api.post("auth/resendVerificationEmail", {}, function(data) {
				if (data.status == "ok") {
					that.setState({
						resendLoading: false,
						resendSent: true
					});
				} else {
					that.setState({
						resendLoading: false,
						error: errors.getFriendlyString(data.error)
					});
				}
			});
		});
	}

	render(props, state) {
		return <div class="accountPane">
			{state.error && <div class="alert alert-danger">{state.error}</div>}

			<div class="accountGroup">
				<div class="profile">
					<h3 class="name">{props.me.name}</h3>
					<h4 class="email">
						{props.me.email}
						{props.me.emailVerified ?
							<span class="label label-success"><i class="fa fa-fw fa-check" /> Email verified</span> :
							<span class="label label-warning">
								{!state.resendLoading && !state.resendSent && <span><i class="fa fa-fw fa-exclamation-triangle" /> Email not verified, <a onClick={this.resendVerificationEmail.bind(this)}>resend verification email</a>?</span>}
								{state.resendLoading && <span><LoadingIndicator /> Loading, please wait...</span>}
								{state.resendSent && <span><i class="fa fa-fw fa-check" /> Verification email sent</span>}
							</span>
						}
					</h4>
				</div>
				<button class="btn btn-primary" onClick={this.changeEmail.bind(this)}><i class="fa fa-fw fa-envelope" /> Change email</button>
			</div>

			<div class="accountGroup">
				<h4>Background</h4>
				<button class="btn btn-primary" onClick={this.changeBackground.bind(this)}><i class="fa fa-fw fa-picture-o" /> Change background</button>
			</div>

			<div class="accountGroup">
				<h4>Security</h4>

				<h5>Password</h5>
				<button class="btn btn-primary" onClick={this.changePassword.bind(this)}><i class="fa fa-fw fa-key" /> Change password</button>

				<h5>Two-factor authentication</h5>
				<p>Two-factor authentication adds an additional layer of protection to your account. Whenever you log in, you'll have to enter a one time password, generated by an app on your phone, to access the account.</p>
				<TwoFactorInfo openModal={props.openModal} />
			</div>

			<div class="accountGroup schools">
				<h4>Connected school accounts</h4>
				<p>You can connect your school account to MyHomeworkSpace and we'll automatically import your schedule and other information.</p>

				<button class="btn btn-primary" onClick={this.connectAccount.bind(this)}><i class="fa fa-fw fa-link" /> Connect account</button>
				<SchoolList me={props.me} openModal={props.openModal} />
			</div>
		</div>;
	}
};