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
			username: "",
			password: ""
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
				password: that.state.password
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
		return <div class="loginForm">
			<div class="loginFormTitle">Log in</div>
			<p class="lead">Sign in using your Dalton account</p>
			{state.error && <div class="alert alert-danger">{state.error}</div>}
			<div class="input-group">
				<input type="text" class="form-control" placeholder="Username" onKeyup={this.keyup.bind(this)} onChange={linkState(this, "username")} value={state.username} disabled={state.loading} />
				<span class="input-group-addon">@dalton.org</span>
			</div>
			<div class="input-group no-addon">
				<input type="password" class="form-control" placeholder="Password" onKeyup={this.keyup.bind(this)} onChange={linkState(this, "password")} value={state.password} disabled={state.loading} />
			</div>
			<button class="btn btn-lg btn-primary pull-right" onClick={this.login.bind(this)} disabled={state.loading}>
				{state.loading ? <LoadingIndicator /> : "Log in" }
			</button>
			<div class="clearfix"></div>
		</div>;
	}
};