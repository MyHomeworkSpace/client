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
				} else if (loginData.status == "error" && loginData.error == "two_factor_required") {
					that.setState({
						error: null,
						twoFactor: true,
						loading: false,
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
		if (!state.twoFactor) {
			if (!props.bootstrap4) {
				return <div class="loginForm">
					<div class="loginFormTitle">Log in</div>
					<p class="lead">Sign in using your Dalton account</p>
					{state.error && <div class="alert alert-danger">{state.error}</div>}
					<div class="input-group bs3">
						<input type="text" class="form-control" placeholder="Username" onKeyup={this.keyup.bind(this)} onChange={linkState(this, "username")} value={state.username} disabled={state.loading} />
						<span class="input-group-addon">@dalton.org</span>
					</div>
					<div class="input-group no-addon bs3">
						<input type="password" class="form-control" placeholder="Password" onKeyup={this.keyup.bind(this)} onChange={linkState(this, "password")} value={state.password} disabled={state.loading} />
					</div>
					<button class="btn btn-lg btn-primary pull-right" onClick={this.login.bind(this)} disabled={state.loading}>
						{state.loading ? <LoadingIndicator /> : "Log in"}
					</button>
					<div class="clearfix"></div>
				</div>;
			}
			return <div class="loginForm">
				<div class="loginFormTitle">Log in</div>
				<p class="lead">Sign in using your Dalton account</p>
				{state.error && <div class="alert alert-danger">{state.error}</div>}
				<div class="input-group mb-3">
					<input type="text" class="form-control" placeholder="Username" onKeyup={this.keyup.bind(this)} onChange={linkState(this, "username")} value={state.username} disabled={state.loading} />
					<div class="input-group-append">
						<span class="input-group-text" id="basic-addon2">@dalton.org</span>
					</div>
				</div>
				<div class="input-group no-addon">
					<input type="password" class="form-control" placeholder="Password" onKeyup={this.keyup.bind(this)} onChange={linkState(this, "password")} value={state.password} disabled={state.loading} />
				</div>
				<button class="btn btn-lg btn-primary pull-right bs4" onClick={this.login.bind(this)} disabled={state.loading}>
					{state.loading ? <LoadingIndicator /> : "Log in"}
				</button>
				<div class="clearfix"></div>
			</div>;
		}

		return <div class="loginForm">
			<div class="loginFormTitle">Log in</div>
			<p class="lead">A two factor authentication code is required to log into this account. Get one from your Two Factor Authentication app.</p>
			<p>Lost your phone? Try to set up another device using your emergency key. Having other issues? Feel free to reach out to us at hello@myhomework.space for assistance.</p>
			{state.error && <div class="alert alert-danger">{state.error}</div>}
			<div class={`input-group no-addon ${props.bootstrap4 ? "" : "bs3"}`}>
				<input type="text" class="form-control" placeholder="Two factor code" onKeyup={this.keyup.bind(this)} onchange={linkState(this, "code")} value={state.code} disabled={state.loading} />
			</div>
			<button class="btn btn-lg btn-primary pull-right bs4" onClick={this.login.bind(this)} disabled={state.loading}>
				{state.loading ? <LoadingIndicator /> : "Log in"}
			</button>
			<div class="clearfix"></div>
		</div>
	}
};