import "settings/panes/account/TwoFactorModal.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";
import errors from "errors.js";

import Modal from "ui/Modal.jsx";

export default class TwoFactorModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			code: "",
			loading: false,
			phase: 1
		};
	}

	changePhase(offset) {
		this.setState({
			error: null,
			phase: this.state.phase + offset
		});
	}

	reload() {
		window.location.reload();
	}

	beginEnroll() {
		this.setState({
			loading: true,
			error: null
		}, () => {
			api.post("auth/2fa/beginEnroll", {}, (data) => {
				if (data.status == "ok") {
					this.setState({
						loading: false,
						secret: data.secret,
						imageURL: data.imageURL,
						phase: 2
					});
				} else {
					this.setState({
						loading: false,
						error: errors.getFriendlyString(data.error)
					});
				}
			});
		});
	}

	completeEnroll() {
		this.setState({
			loading: true,
			error: null
		}, () => {
			api.post("auth/2fa/completeEnroll", {
				code: this.state.code
			}, (data) => {
				if (data.status == "ok") {
					this.setState({
						loading: false,
						phase: 4
					});
				} else {
					this.setState({
						loading: false,
						error: errors.getFriendlyString(data.error)
					});
				}
			});
		});
	}

	unenroll() {
		this.setState({
			loading: true,
			error: null
		}, () => {
			api.post("auth/2fa/unenroll", {
				code: this.state.code
			}, (data) => {
				if (data.status == "ok") {
					this.setState({
						loading: false,
						phase: 2
					});
				} else {
					this.setState({
						loading: false,
						error: errors.getFriendlyString(data.error)
					});
				}
			});
		});
	}

	render(props, state) {
		let body;
		let footer;
		let noClose = false;

		if (!props.modalState.enrolled) {
			if (state.phase == 1) {
				body = <div>
					<p>Two-factor authentication is a method of adding additional security to your MyHomeworkSpace account.</p>
					<p>When you log in, you'll be asked to provide both your password and a special code from an app on your phone. This code changes once every 30 seconds. That way, if someone gets access to your password, they still won't be able to access your account without this code.</p>
				</div>;
				footer = <div>
					<button type="button" class="btn btn-primary" disabled={state.loading} onClick={this.beginEnroll.bind(this)}>Next</button>
				</div>;
			} else if (state.phase == 2) {
				body = <div>
					<p>If you don't have one already, you'll need an authenticator app. We recommend Google Authenticator, which you can download for <a href="https://appstore.com/googleauthenticator" target="_blank" rel="noopener noreferrer">iOS</a> or <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" target="_blank" rel="noopener noreferrer">Android</a>; however, there are many other compatible apps.</p>
					<p>Once you've downloaded an authenticator app, scan the barcode below. Alternatively, you can type your emergency key into the authenticator app.</p>

					<img height="200" width="200" class="twoFactorBarcodeImage" src={state.imageURL}></img>

					<p><strong>Emergency key:</strong> <code>{state.secret}</code></p>
					<i class="fa fa-info-circle" /> <span class="twoFactorEmergencyWarning">Make sure you've saved your emergency key somewhere secure.</span> You'll need it in case you lose access to your phone.
				</div>;
				footer = <div>
					<button type="button" class="btn btn-default" disabled={state.loading} onClick={this.changePhase.bind(this, -1)}>Back</button>
					<button type="button" class="btn btn-primary" disabled={state.loading} onClick={this.changePhase.bind(this, 1)}>Next</button>
				</div>;
			} else if (state.phase == 3) {
				body = <div>
					<p>To confirm that you've set it up correctly, enter the current code displayed by your authentication app.</p>
					<div class="input-group">
						<input type="text" class="form-control" placeholder="Authentication code" disabled={state.loading} onInput={linkState(this, "code")} value={state.code} />
					</div>
				</div>;
				footer = <div>
					<button type="button" class="btn btn-default" disabled={state.loading} onClick={this.changePhase.bind(this, -1)}>Back</button>
					<button type="button" class="btn btn-primary" disabled={state.loading || !state.code} onClick={this.completeEnroll.bind(this)}>Next</button>
				</div>;
			} else if (state.phase == 4) {
				body = <div>
					<p>Two-factor authentication has been enabled for your account!</p>
				</div>;
				footer = <div>
					<button type="button" class="btn btn-primary" disabled={state.loading || !state.code} onClick={this.reload.bind(this)}>Finish</button>
				</div>;
				noClose = true;
			}
		} else {
			if (state.phase == 1) {
				body = <div>
					<p><strong>Disabling two-factor authentication reduces the security of your account.</strong></p>
					<p>To confirm this action, please enter the current two-factor code from your authentication device:</p>
					<div class="input-group">
						<input type="text" class="form-control" placeholder="Authentication code" disabled={state.loading} onInput={linkState(this, "code")} value={state.code} />
					</div>
				</div>;
				footer = <div>
					<button type="button" class="btn btn-danger" disabled={state.loading || !state.code} onClick={this.unenroll.bind(this)}>Disable</button>
				</div>;
			} else if (state.phase == 2) {
				body = <div>
					<p>Two-factor authentication has been disabled for your account.</p>
				</div>;
				footer = <div>
					<button type="button" class="btn btn-primary" disabled={state.loading || !state.code} onClick={this.reload.bind(this)}>Finish</button>
				</div>;
				noClose = true;
			}
		}

		return <Modal title={`${props.modalState.enrolled ? "Disable" : "Enable"} two-factor authentication`} openModal={props.openModal} class="twoFactorModal" noClose={state.loading || noClose}>
			<div class="modal-body">
				{state.error && <div class="alert alert-danger">{state.error}</div>}
				{body}
			</div>
			<div class="modal-footer">
				{footer}
			</div>
		</Modal>;
	}
};