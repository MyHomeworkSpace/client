import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";
import errors from "errors.js";

import Modal from "ui/Modal.jsx";

export default class DeleteAccountModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			error: "",

			stage: 0,
			password: ""
		};
	}

	close() {
		this.props.openModal("");
	}

	continueDelete() {
		this.setState({
			stage: 1
		});
	}

	finishDelete() {
		this.setState({
			loading: true,
			error: ""
		}, () => {
			api.post("auth/requestAccountDelete", {
				password: this.state.password,
				clientType: "web"
			}, (data) => {
				if (data.status == "ok") {
					this.setState({
						loading: false,
						stage: 2
					});
				} else {
					if (data.error == "creds_incorrect") {
						this.setState({
							loading: false,
							error: "The password was incorrect."
						});
						return;
					}

					this.setState({
						loading: false,
						error: errors.getFriendlyString(data.error)
					});
				}
			});
		});
	}

	keyup(e) {
		if (e.keyCode == 13) {
			this.finishDelete();
		}
	}

	render(props, state) {
		if (state.stage == 1) {
			return <Modal class="deleteAccountModal" title="Request account deletion" openModal={props.openModal}>
				<div class="modal-body">
					<p>To delete your account, confirm your password.</p>
					{state.error && <div class="alert alert-danger">{state.error}</div>}
					<input
						type="password"
						class="form-control"
						value={state.password}
						onInput={linkState(this, "password")}
						disabled={state.loading}
						onKeyUp={this.keyup.bind(this)}
					/>
				</div>
				<div class="modal-footer">
					<button class="btn btn-danger" onClick={this.finishDelete.bind(this)} disabled={state.loading || state.password.length == 0}>Delete</button>
				</div>
			</Modal>;
		}

		if (state.stage == 2) {
			return <Modal class="deleteAccountModal" title="Request account deletion" openModal={props.openModal}>
				<div class="modal-body">
					<p><strong>Your account has been scheduled for deletion within 48 hours.</strong></p>
					<p>If you decide to cancel this request, email hello@myhomework.space as soon as possible.</p>
					<p>Confirmation of this has been sent to your email, and you will receive a second email once your account is deleted.</p>
					<p>Note that some of your data might remain on our systems even after your account is deleted - for example, your account might still be present in our automated database backups.</p>
				</div>
				<div class="modal-footer">
					<button class="btn btn-primary" onClick={this.close.bind(this)}>OK</button>
				</div>
			</Modal>;
		}

		return <Modal class="deleteAccountModal" title="Request account deletion" openModal={props.openModal}>
			<div class="modal-body">
				<p>You can request deletion of your account.</p>
				<p><strong>All of your homework, classes, and calendar events will be deleted.</strong></p>
				<p>This action cannot be undone.</p>
			</div>
			<div class="modal-footer">
				<button class="btn btn-danger" onClick={this.continueDelete.bind(this)}>Delete</button>
			</div>
		</Modal>;
	}
};