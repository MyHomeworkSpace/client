import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";
import errors from "errors.js";

import FullForm from "ui/FullForm.jsx";
import LoadingIndicator from "ui/LoadingIndicator.jsx";

export default class ResetPasswordForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			email: ""
		};
	}

	submit() {
		var that = this;

		this.setState({
			loading: true,
			error: ""
		}, function() {
			api.post("auth/resetPassword", {
				email: this.state.email
			}, function(data) {
				if (data.status == "ok") {
					that.setState({
						loading: false,
						success: true
					});
				} else {
					that.setState({
						loading: false,
						error: errors.getFriendlyString(data.error)
					});
				}
			});
		});
	}

	keyup(e) {
		if (e.keyCode == 13) {
			this.submit();
		}
	}

	render(props, state) {
		if (state.loading) {
			return <FullForm>
				<LoadingIndicator /> Loading, please wait...
			</FullForm>;
		}
		if (state.success) {
			return <FullForm>
				<div class="fullFormTitle">Reset password</div>
				<p>We've sent a verification email to that address. Click the link in that email in order to finish the password reset process.</p>
			</FullForm>;
		}

		return <FullForm>
			<div class="fullFormTitle">Reset password</div>

			{state.error && <div class="alert alert-danger">{state.error}</div>}

			<p>Enter the email associated with your MyHomeworkSpace account.</p>

			<div class="input-group no-addon">
				<input type="email" class="form-control" placeholder="Email" onKeyup={this.keyup.bind(this)} onChange={linkState(this, "email")} value={state.email} />
			</div>

			<div class="pull-right">
				<button class="btn btn-lg btn-primary" onClick={this.submit.bind(this)}>
					Reset
				</button>
			</div>

			<div class="clearfix"></div>
		</FullForm>;
	}
}