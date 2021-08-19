import "schools/cornell/CornellEnroll.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";
import errors from "errors.js";

export default class CornellEnroll extends Component {
	constructor(props) {
		super(props);

		var netID = "";
		if (props.email) {
			netID = props.email.split("@")[0];
		}

		this.state = {
			loading: false,
			error: "",

			netID: netID,
			password: "",
		};
	}

	login() {
		if (this.state.netID == "") {
			this.setState({
				error: "You must enter your NetID."
			});
			return;
		}

		if (this.state.password == "") {
			this.setState({
				error: "You must enter your NetID Password."
			});
			return;
		}

		this.setState({
			loading: true
		}, () => {
			api.post("schools/enroll", {
				school: "cornell",
				reenroll: this.props.reenroll,
				data: JSON.stringify({
					username: this.state.netID,
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
		return <div class="cornellEnroll">
			<div class="alert alert-warning">It can take up to 30 minutes for Student Center to export your schedule after making changes. If you log in, and your schedule is incorrect, try again in about a half hour.
			As of right now, we also don't support accounts with <a href="https://it.cornell.edu/twostep/expand-where-you-use-two-step-login" target="_blank" rel="noopener noreferrer">expanded two-step</a> enabled.
			If you don't know what this is, chances are you don't have it enabled.</div>
			{state.error && <div class="alert alert-danger">{state.error}</div>}
			Sign in with your Cornell NetID and Password.
			<div class="form-group">
				<input type="text" class="form-control" placeholder="NetID" onKeyUp={this.onKeyUp.bind(this)} onChange={linkState(this, "netID")} value={state.netID} disabled={state.loading} />
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