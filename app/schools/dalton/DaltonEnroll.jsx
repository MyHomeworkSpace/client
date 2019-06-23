import "schools/dalton/DaltonEnroll.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";
import errors from "errors.js";

export default class DaltonEnroll extends Component {
	constructor(props) {
		super(props);

		var username = "";
		if (props.email) {
			username = props.email.split("@")[0];
		}

		this.state = {
			loading: false,
			error: "",

			username: username,
			password: "",
		};
	}

	login() {
		if (this.state.username == "") {
			this.setState({
				error: "You must enter your Dalton username."
			});
			return;
		}

		if (this.state.password == "") {
			this.setState({
				error: "You must enter your Dalton password."
			});
			return;
		}

		var that = this;
		this.setState({
			loading: true
		}, function() {
			api.post("schools/enroll", {
				school: "dalton",
				data: JSON.stringify({
					username: that.state.username,
					password: that.state.password
				})
			}, function(data) {
				if (data.status == "ok") {
					that.props.next();
				} else {
					that.setState({
						loading: false,
						error: errors.getFriendlyString(data.error)
					});
				}
			});
		});
	}

	onKeyUp(e) {
		if (e.keyCode == 13) {
			this.login();
		}
	}

	render(props, state) {
		return <div class="daltonEnroll">
			{state.error && <div class="alert alert-danger">{state.error}</div>}
			Sign in with your Dalton username and password.
			<div class="form-group">
				<input type="text" class="form-control" placeholder="Username" onKeyUp={this.onKeyUp.bind(this)} onChange={linkState(this, "username")} value={state.username} disabled={state.loading} />
			</div>
			<div class="form-group">
				<input type="password" class="form-control" placeholder="Password" onKeyUp={this.onKeyUp.bind(this)} onChange={linkState(this, "password")} value={state.password} disabled={state.loading} />
			</div>
			<div class="form-group actions">
				<button class="btn btn-default" onClick={props.prev} disabled={state.loading}><i class="fa fa-chevron-left" /></button>
				<button class="btn btn-primary" onClick={this.login.bind(this)} disabled={state.loading}>Log in <i class="fa fa-chevron-right" /></button>
			</div>
		</div>;
	}
};