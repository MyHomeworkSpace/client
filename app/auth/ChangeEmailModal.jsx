import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";
import errors from "errors.js";

import Modal from "ui/Modal.jsx";

export default class ChangeEmailModal extends Component {
	constructor() {
		super();
		this.state = {
			newEmail: ""
		};
	}

	close() {
		this.props.openModal("");
	}

	submit() {
		if (this.state.newEmail == "") {
			this.setState({
				error: "You must enter a new email!"
			});
			return;
		}

		this.setState({
			loading: true,
			error: ""
		}, function() {
			api.post("auth/changeEmail", {
				new: this.state.newEmail
			}, (data) => {
				if (data.status == "ok") {
					this.setState({
						loading: false,
						success: true
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

	keyup(e) {
		if (e.keyCode == 13) {
			this.submit();
		}
	}	

	render(props, state) {
		if (state.success) {
			return <Modal title="Change email" openModal={props.openModal}>
				<div class="modal-body">
					<p>We've sent a verification email to <strong>{state.newEmail}</strong>. Click the link in that email to finish changing your email address.</p>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" onClick={this.close.bind(this)}>Close</button>
				</div>
			</Modal>;
		}

		return <Modal title="Change email" openModal={props.openModal} noClose={state.loading}>
			<div class="modal-body">
				{state.error && <div class="alert alert-danger">{state.error}</div>}

				<p>Enter your new email.</p>
				<input type="email" class="form-control" placeholder="New email" onKeyup={this.keyup.bind(this)} onChange={linkState(this, "newEmail")} value={state.newEmail} disabled={state.loading} />
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-primary" onClick={this.submit.bind(this)} disabled={state.loading}>Change</button>
			</div>
		</Modal>;
	}
};