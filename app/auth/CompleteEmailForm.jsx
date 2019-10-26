import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";
import consts from "consts.js";
import errors from "errors.js";

import FullForm from "ui/FullForm.jsx";
import LoadingIndicator from "ui/LoadingIndicator.jsx";
import { PasswordSecurityCheck, checkPassword } from "auth/PasswordSecurityCheck.jsx";

export default class CompleteEmailForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			success: false,
			password: "",
			passwordConf: ""
		};
	}

	componentWillMount() {
		this.submit();
	}

	submit() {
		var that = this;

		var params = {
			token: this.props.params[0]
		};

		if (this.state.tokenType == consts.TOKEN_TYPE_RESET_PASSWORD) {
			if (this.state.password == "") {
				this.setState({
					error: "You must enter a new password!"
				});
				return;
			}
			if (this.state.passwordConf == "") {
				this.setState({
					error: "You must enter the confirmation of your new password!"
				});
				return;
			}

			if (this.state.password != this.state.passwordConf) {
				this.setState({
					error: "The two passwords don't match."
				});
				return;
			}

			params.password = this.state.password;
		}

		this.setState({
			loading: true,
			error: ""
		}, function() {
			api.post("auth/completeEmail", params, function(data) {
				if (data.status == "ok") {
					that.setState({
						loading: false,
						tokenType: data.token.type,
						success: !data.infoRequired
					});
				} else {
					that.setState({
						loading: false,
						tokenType: consts.TOKEN_TYPE_NONE
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

		var title;
		var contents;
		var buttons;
		if (state.tokenType == consts.TOKEN_TYPE_RESET_PASSWORD) {
			if (state.success) {
				title = "Reset password";
				contents = <div>
					<p>Your password has been changed successfully!</p>
					<a href="/" class="btn btn-primary">Back to MyHomeworkSpace</a>
				</div>;
			} else {
				title = "Reset password";
				contents = <div>
					<div class="row">
						<div class="col-md-4">
							<PasswordSecurityCheck password={state.password} />
						</div>
						<div class="col-md-8">
							<p>Enter a new password for your MyHomeworkSpace account. You must enter your new password twice to confirm that you didn't mistype it the first time. Passwords must follow the password guidelines on the left.</p>
							<input type="password" class="form-control" placeholder="New password" onKeyup={this.keyup.bind(this)} onInput={linkState(this, "password")} value={state.password} disabled={state.loading} />
							<input type="password" class="form-control" placeholder="New password (again)" onKeyup={this.keyup.bind(this)} onInput={linkState(this, "passwordConf")} value={state.passwordConf} disabled={state.loading} />
						</div>
					</div>
				</div>;
				buttons = <button class="btn btn-lg btn-primary" onClick={this.submit.bind(this)} disabled={checkPassword(state.password).length != 0}>
					Change
				</button>;
			}
		} else if (state.tokenType == consts.TOKEN_TYPE_CHANGE_EMAIL) {
			title = "Change email";
			contents = <div>
				<p>Your email has been changed successfully!</p>
				<a href="/" class="btn btn-primary">Back to MyHomeworkSpace</a>
			</div>;
		}  else if (state.tokenType == consts.TOKEN_TYPE_VERIFY_EMAIL) {
			title = "Verify email";
			contents = <div>
				<p>Your email has been verified successfully!</p>
				<a href="/" class="btn btn-primary">Back to MyHomeworkSpace</a>
			</div>;
		} else {
			title = "Link expired";
			contents = <div>
				<p>That email seems to have expired! Please retry the action you were attempting.</p>
			</div>;
		}

		return <FullForm>
			<div class="fullFormTitle">{title}</div>

			{state.error && <div class="alert alert-danger">{state.error}</div>}

			{contents}

			{buttons && <div class="pull-right">{buttons}</div>}

			<div class="clearfix"></div>
		</FullForm>;
	}
}