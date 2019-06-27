import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";
import consts from "consts.js";
import errors from "errors.js";

import FullForm from "ui/FullForm.jsx";
import LoadingIndicator from "ui/LoadingIndicator.jsx";

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
			token: this.props.param
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
					<a href="/app.html" class="btn btn-primary">Back to MyHomeworkSpace</a>
				</div>;
			} else {
				title = "Reset password";
				contents = <div>
					<p>Enter a new password for your MyHomeworkSpace account.</p>
					<div class="input-group no-addon">
						<input type="password" class="form-control" placeholder="New password" onKeyup={this.keyup.bind(this)} onChange={linkState(this, "password")} value={state.password} />
					</div>
					<div class="input-group no-addon">
						<input type="password" class="form-control" placeholder="New password (again)" onKeyup={this.keyup.bind(this)} onChange={linkState(this, "passwordConf")} value={state.passwordConf} />
					</div>
				</div>;
				buttons = <button class="btn btn-lg btn-primary" onClick={this.submit.bind(this)}>
					Change
				</button>;
			}
		} else if (state.tokenType == consts.TOKEN_TYPE_CHANGE_EMAIL) {
			title = "Change email";
			contents = <div>
				<p>Your email has been changed successfully!</p>
				<a href="/app.html" class="btn btn-primary">Back to MyHomeworkSpace</a>
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