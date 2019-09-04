import "auth/ApplicationAuthForm.styl";

import { h, Component } from "preact";

import api from "api.js";
import errors from "errors.js";

import FullForm from "ui/FullForm.jsx";
import LoadingIndicator from "ui/LoadingIndicator.jsx";

export default class ApplicationAuthForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true
		};
	}

	componentDidMount() {
		var that = this;
		var applicationID = this.props.params[0];
		api.get("application/get/" + applicationID, {}, function(data) {
			if (data.status == "ok") {
				that.setState({
					loading: false,
					application: data.application
				});
			} else {
				that.setState({
					loading: false,
					error: errors.getFriendlyString(data.error)
				});
			}
		});
	}

	logout() {
		api.get("auth/logout", {}, function() {
			window.location.reload();
		});
	}

	deny() {
		window.location.href = "https://myhomework.space";
	}

	allow() {
		var that = this;

		var applicationID = this.props.params[0];
		var state = this.props.params[1];

		this.setState({
			loading: true
		}, function() {
			api.post("application/completeAuth", {
				clientId: applicationID
			}, function(data) {
				if (data.status == "ok") {
					window.location.href = that.state.application.callbackUrl + "?token=" + escape(data.token) + (state ? "&state=" + encodeURIComponent(atob(state)) : "");
				} else {
					that.setState({
						loading: false,
						error: errors.getFriendlyString(data.error)
					});
				}
			});
		});
	}

	render(props, state) {
		if (state.loading) {
			return <FullForm class="applicationAuthForm">
				<LoadingIndicator /> Loading, please wait...
			</FullForm>;
		}

		return <FullForm class="applicationAuthForm">
			<div class="fullFormTitle">Allow application access</div>

			{state.error && <div class="alert alert-danger">{state.error}</div>}

			<p class="lead">An external application is requesting access to your account and all of its data.</p>

			<p>Not <strong>{props.me.name}</strong>? <a onClick={this.logout.bind(this)}>Log out</a> and switch to your account.</p>

			<h3>{state.application.name}</h3>
			{state.application.authorName && <h4>{state.application.authorName}</h4>}

			<p class="details"><strong>{state.application.name}</strong> may have different data use policies from MyHomeworkSpace. You can control what applications can access your account and revoke access at any time from the Settings tab.</p>

			<div class="pull-right">
				<button class="btn btn-lg btn-danger" onClick={this.deny.bind(this)}>
					Deny
				</button>
				<button class="btn btn-lg btn-primary" onClick={this.allow.bind(this)}>
					Allow
				</button>
			</div>

			<div class="clearfix"></div>
		</FullForm>;
	}
}