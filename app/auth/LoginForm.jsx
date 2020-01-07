import "auth/LoginForm.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";
import errors from "errors.js";

import FullForm from "ui/FullForm.jsx";
import LoadingIndicator from "ui/LoadingIndicator.jsx";

export default class LoginForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			twoFactor: false,
			email: "",
			password: "",
			code: "",
		};
	}

	keyup(e) {
		if (e.keyCode == 13) {
			this.login();
		}
	}

	cancel2fa() {
		this.setState({
			error: null,
			code: "",
			twoFactor: false
		});
	}

	login() {
		if (this.state.email.trim() == "") {
			this.setState({
				error: "You must enter your email!"
			});
			return;
		}
		if (this.state.password.trim() == "") {
			this.setState({
				error: "You must enter your password!"
			});
			return;
		}

		if (this.state.email.indexOf("@") == -1) {
			var daltonRegexResults = this.state.email.match(/c\d\d\w\w\d*/i);
			if (daltonRegexResults && daltonRegexResults.length > 0 && daltonRegexResults[0] == this.state.email) {
				this.props.openModal("accountMigrate", {
					username: this.state.email
				});
				return;
			}
		}

		this.setState({
			loading: true,
			error: ""
		}, () => {
			api.post("auth/login", {
				email: this.state.email,
				password: this.state.password,
				code: this.state.code,
			}, (loginData) => {
				if (loginData.status == "ok") {
					api.get("auth/me", {}, (userData) => {
						if (userData.status == "ok") {
							this.props.callback(userData, (this.props.params.length > 0 ? this.props.params.join(":") : ""));
						} else {
							this.setState({
								loading: false,
								error: errors.getFriendlyString(userData.error)
							});
						}
					});
				} else if (loginData.status == "error" && loginData.error == "totp_required") {
					this.setState({
						loading: false,
						error: null,
						twoFactor: true,
						code: ""
					});
				} else {
					this.setState({
						loading: false,
						error: errors.getFriendlyString(loginData.error)
					});
				}
			});
		});
	}

	render(props, state) {
		if (state.twoFactor) {
			return <FullForm class="loginForm">
				<div class="fullFormTitle">Verify code</div>
				<p class="lead">You'll need a code from your two-factor authentication device</p>

				{state.error && <div class="alert alert-danger">{state.error}</div>}
				<div class="input-group">
					<input type="text" class="form-control" placeholder="Authentication code" disabled={state.loading} onInput={linkState(this, "code")} onKeyup={this.keyup.bind(this)} value={state.code} />
				</div>

				<div class="loginFormActions pull-right">
					<button class="btn btn-lg btn-default" onClick={this.cancel2fa.bind(this)} disabled={state.loading}>
						Back
					</button>
					<button class="btn btn-lg btn-primary" onClick={this.login.bind(this)} disabled={state.loading}>
						{state.loading ? <LoadingIndicator /> : "Verify"}
					</button>
				</div>

				<div class="clearfix"></div>
			</FullForm>;
		}

		return <FullForm class="loginForm">
			<div class="fullFormTitle">Log in</div>
			<p class="lead">Sign in using your MyHomeworkSpace account</p>

			{props.params.length > 0 && <div class="alert alert-info">To access that page, log in to your MyHomeworkSpace account.</div>}
			{state.error && <div class="alert alert-danger">{state.error}</div>}
			<div class="input-group no-addon">
				<input type="email" class="form-control" placeholder="Email address" onKeyup={this.keyup.bind(this)} onChange={linkState(this, "email")} value={state.email} disabled={state.loading} />
			</div>
			<div class="input-group no-addon">
				<input type="password" class="form-control" placeholder="Password" onKeyup={this.keyup.bind(this)} onChange={linkState(this, "password")} value={state.password} disabled={state.loading} />
			</div>

			<a href="#!resetPassword" class="btn btn-default pull-left">Forgot password</a>
			<a href="#!createAccount" class="btn btn-default pull-left">Create account</a>

			<button class="btn btn-lg btn-primary pull-right" onClick={this.login.bind(this)} disabled={state.loading}>
				{state.loading ? <LoadingIndicator /> : "Log in"}
			</button>

			<div class="clearfix"></div>
		</FullForm>;
	}
};