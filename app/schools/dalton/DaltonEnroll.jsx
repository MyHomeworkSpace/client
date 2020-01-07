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

		this.setState({
			loading: true
		}, () => {
			api.post("schools/enroll", {
				school: "dalton",
				reenroll: this.props.reenroll,
				data: JSON.stringify({
					username: this.state.username,
					password: this.state.password
				})
			}, (data) => {
				if (data.status == "ok") {
					this.props.next();
				} else {
					this.setState({
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
			<div class="input-group first">
				<input type="text" class="form-control" placeholder="Username" aria-describedby="username-addon" onKeyUp={this.onKeyUp.bind(this)} onChange={linkState(this, "username")} value={state.username} disabled={state.loading} />
				<span class="input-group-addon" id="username-addon">@dalton.org</span>
			</div>
			<div class="form-group">
				<input type="password" class="form-control" placeholder="Password" onKeyUp={this.onKeyUp.bind(this)} onChange={linkState(this, "password")} value={state.password} disabled={state.loading} />
			</div>
			<div class="form-group actions">
				{state.loading && <span><i class="fa fa-circle-o-notch fa-spin fa-fw"></i> Importing schedule...</span>}
				<button class="btn btn-default" onClick={props.prev} disabled={state.loading}><i class="fa fa-chevron-left" /></button>
				<button class="btn btn-primary" onClick={this.login.bind(this)} disabled={state.loading}>Log in <i class="fa fa-chevron-right" /></button>
			</div>
		</div>;
	}
};