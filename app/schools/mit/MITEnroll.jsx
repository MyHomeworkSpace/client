import "schools/mit/MITEnroll.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";
import errors from "errors.js";

/*
 * mit enrollment stages:
 * 0 = enter kerberos username/password
 * 1 = duo
 */

export default class MITEnroll extends Component {
	constructor(props) {
		super(props);

		var username = "";
		if (props.email) {
			username = props.email.split("@")[0];
		}

		this.state = {
			loading: false,
			error: "",

			stage: 0,
			duo: null,

			duoMethod: -1,

			username: username,
			password: "",
		};
	}

	login() {
		if (this.state.username == "") {
			this.setState({
				error: "You must enter your Kerberos username."
			});
			return;
		}

		if (this.state.password == "") {
			this.setState({
				error: "You must enter your Kerberos password."
			});
			return;
		}

		this.setState({
			loading: true,
			error: ""
		}, () => {
			api.post("schools/enroll", {
				school: "mit",
				data: JSON.stringify({
					stage: 0,
					username: this.state.username,
					password: this.state.password
				})
			}, (data) => {
				if (data.status == "ok") {
					this.props.next();
				} else {
					if (data.error == "more_info") {
						this.setState({
							loading: false,
							stage: 1,
							duo: data.details.duo
						});
					} else {
						this.setState({
							loading: false,
							error: errors.getFriendlyString(data.error)
						});
					}
				}
			});
		});
	}

	onKeyUp(e) {
		if (e.keyCode == 13) {
			this.login();
		}
	}

	prevStage() {
		this.setState({
			stage: 0
		});
	}

	completeDuo() {
		if (this.state.duoMethod == -1) {
			this.setState({
				error: "You must select a Duo method!"
			});
			return;
		}

		this.setState({
			loading: true,
			error: ""
		}, () => {
			api.post("schools/enroll", {
				school: "mit",
				reenroll: this.props.reenroll,
				data: JSON.stringify({
					stage: 1,
					username: this.state.username,
					password: this.state.password,
					duoMethodIndex: parseInt(this.state.duoMethod)
				})
			}, (data) => {
				if (data.status == "ok") {
					this.props.next();
				} else {
					if (data.error == "duo_denied") {
						this.setState({
							loading: false,
							error: "The Duo sign-in was denied."
						});
					} else {
						this.setState({
							loading: false,
							error: errors.getFriendlyString(data.error)
						});
					}
				}
			});
		});
	}

	render(props, state) {
		return <div class="mitEnroll">
			{state.error && <div class="alert alert-danger">{state.error}</div>}

			{state.stage == 0 && <div class="stage0">
				Sign in with your Kerberos username and password.
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
			</div>}
			{state.stage == 1 && <div class="stage1">
				To complete your sign-in, you'll need to authenticate with Duo. Select a method:
				<div class="duoMethods">
					{state.duo.methods.map((method, methodIndex) => {
						var supported = (method.FriendlyName == "Duo Push");
						return <div>
							<label class={supported ? "" : "unsupported"}>
								<input
									type="radio"
									value={methodIndex}
									checked={state.duoMethod == methodIndex}
									onChange={linkState(this, "duoMethod", "target.value")}
									disabled={!supported}
								/>
								<div>
									<strong>{method.FriendlyName}</strong> on <strong>{method.DeviceName}</strong>
									{!supported && <span> (unsupported)</span>}
								</div>
							</label>
						</div>;
					})}
				</div>
				<div class="form-group actions">
					<button class="btn btn-default" onClick={this.prevStage.bind(this)} disabled={state.loading}><i class="fa fa-chevron-left" /></button>
					<button class="btn btn-primary" onClick={this.completeDuo.bind(this)} disabled={state.loading}>Continue <i class="fa fa-chevron-right" /></button>
				</div>
			</div>}
		</div>;
	}
};