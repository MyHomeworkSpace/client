import "ui/LoginForm.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";
import errors from "errors.js";

import LoadingIndicator from "ui/LoadingIndicator.jsx";

export default class LoginForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			twoFactor: false,
			username: "",
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
		var that = this;

		if (this.state.username.trim() == "") {
			this.setState({
				error: "You must enter your username!"
			});
			return;
		}
		if (this.state.password.trim() == "") {
			this.setState({
				error: "You must enter your password!"
			});
			return;
		}

		this.setState({
			loading: true,
			error: ""
		}, function() {
			api.post("auth/login", {
				username: that.state.username,
				password: that.state.password,
				code: that.state.code,
			}, function(loginData) {
				if (loginData.status == "ok") {
					api.get("auth/me", {}, function(userData) {
						if (userData.status == "ok") {
							that.props.callback.call(that, userData);
						} else {
							that.setState({
								loading: false,
								error: errors.getFriendlyString(userData.error)
							});
						}
					});
				} else if (loginData.status == "error" && loginData.error == "totp_required") {
					that.setState({
						loading: false,
						error: null,
						twoFactor: true,
						code: ""
					})
				} else {
					that.setState({
						loading: false,
						error: errors.getFriendlyString(loginData.error)
					});
				}
			});
		});
	}

	render(props, state) {
		if (state.twoFactor) {
			return <div class={`loginForm ${props.bootstrap4 ? "bs4" : "bs3"}`}>
				<div class="loginFormTitle">Verify code</div>
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
			</div>;
		}

		return <div class={`loginForm ${props.bootstrap4 ? "bs4" : "bs3"}`}>
			<div class="loginFormTitle">Log in</div>
			<p class="lead">Sign in using your Dalton account</p>

			{state.error && <div class="alert alert-danger">{state.error}</div>}
			<div class="input-group mb-3">
				<input type="text" class="form-control" placeholder="Username" onKeyup={this.keyup.bind(this)} onChange={linkState(this, "username")} value={state.username} disabled={state.loading} />
				{props.bootstrap4 ?
					<div class="input-group-append">
						<span class="input-group-text">@dalton.org</span>
					</div>
					:
					<span class="input-group-addon">@dalton.org</span>
				}
			</div>
			<div class="input-group no-addon">
				<input type="password" class="form-control" placeholder="Password" onKeyup={this.keyup.bind(this)} onChange={linkState(this, "password")} value={state.password} disabled={state.loading} />
			</div>

			<button class="btn btn-lg btn-primary pull-right" onClick={this.login.bind(this)} disabled={state.loading}>
				{state.loading ? <LoadingIndicator /> : "Log in"}
			</button>

			<div class="clearfix"></div>
		</div>;
	}
};