import "auth/CreateAccountForm.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";
import errors from "errors.js";

import { PasswordSecurityCheck, checkPassword } from "auth/PasswordSecurityCheck.jsx";

import FullForm from "ui/FullForm.jsx";
import LoadingIndicator from "ui/LoadingIndicator.jsx";

export default class CreateAccountForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			name: "",
			email: "",
			password: "",
			passwordConf: ""
		};
	}

	create() {
		var that = this;

		if (this.state.name == "") {
			this.setState({
				error: "You must enter your name!"
			});
			return;
		}
		if (this.state.email == "") {
			this.setState({
				error: "You must enter your email address!"
			});
			return;
		}
		if (this.state.password == "") {
			this.setState({
				error: "You must enter your password!"
			});
			return;
		}
		if (this.state.passwordConf == "") {
			this.setState({
				error: "You must enter the confirmation of your password!"
			});
			return;
		}

		if (this.state.password != this.state.passwordConf) {
			this.setState({
				error: "The two passwords don't match."
			});
			return;
		}

		if (!checkPassword(this.state.password)) {
			this.setState({
				error: "Your password doesn't meet the security requirements."
			});
			return;
		}

		this.setState({
			loading: true
		}, function() {
			api.post("auth/createAccount", {
				name: that.state.name,
				email: that.state.email,
				password: that.state.password
			}, function(data) {
				if (data.status == "ok") {
					api.get("auth/me", {}, function(userData) {
						if (userData.status == "ok") {
							that.props.handleLoginComplete.call(that, userData, "homework", function() {
								if (data.school) {
									that.props.openModal("enroll", {
										email: that.state.email
									});
								}
							});
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
						error: errors.getFriendlyString(data.error)
					});
				}
			});
		});
	}

	keyup(e) {
		if (e.keyCode == 13) {
			this.create();
		}
	}

	render(props, state) {
		return <FullForm class="createAccountForm">
			<div class="fullFormTitle">Create account</div>
			<p className="lead">On behalf of the entire MyHomeworkSpace team, welcome! We're glad to have you.</p>
			{state.error && <div class="alert alert-danger">{state.error}</div>}
			<div class="input-group no-addon">
				<input type="text" class="form-control" placeholder="Your name" onKeyup={this.keyup.bind(this)} onInput={linkState(this, "name")} value={state.name} disabled={state.loading} />
				<small class="form-text text-muted">Enter whatever you prefer to be called.</small>
			</div>
			<div class="input-group no-addon">
				<input type="email" class="form-control" placeholder="School email address" onKeyup={this.keyup.bind(this)} onInput={linkState(this, "email")} value={state.email} disabled={state.loading} />
				<small class="form-text text-muted">If you don't have a school email, you can use your personal email.</small>
			</div>
			<div class="row">
				<div class="col-md-8">
					<div class="input-group no-addon">
						<input type="password" class="form-control" placeholder="Password" onKeyup={this.keyup.bind(this)} onInput={linkState(this, "password")} value={state.password} disabled={state.loading} />
					</div>
					<div class="input-group no-addon">
						<input type="password" class="form-control" placeholder="Password (again)" onKeyup={this.keyup.bind(this)} onInput={linkState(this, "passwordConf")} value={state.passwordConf} disabled={state.loading} />
					</div>
				</div>
				<div class="col-md-4">
					<PasswordSecurityCheck password={state.password} />
				</div>
			</div>
			<small class="pull-left text-muted">By creating an account, you agree to our Privacy Policy. We will never sell or market any of your data. <a href="https://legal.myhomework.space" target="_blank" rel="noopener noreferrer">Learn more &raquo;</a></small>
			<button class="btn btn-lg btn-primary pull-right" onClick={this.create.bind(this)} disabled={state.loading}>
				{state.loading ? <LoadingIndicator /> : "Create account"}
			</button>

			<div class="clearfix"></div>
		</FullForm>;
	}
};