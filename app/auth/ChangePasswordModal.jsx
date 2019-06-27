import "auth/ChangePasswordModal.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";
import errors from "errors.js";

import { PasswordSecurityCheck, checkPassword } from "auth/PasswordSecurityCheck.jsx";
import Modal from "ui/Modal.jsx";

export default class ChangePasswordModal extends Component {
	constructor() {
		super();
		this.state = {
			currentPassword: "",
			newPassword: "",
			newPasswordConf: ""
		};
	}

	close() {
		this.props.openModal("");
	}

	submit() {
		var that = this;

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

		this.setState({
			loading: true,
			error: ""
		}, function() {
			api.post("auth/changePassword", {
				current: this.state.currentPassword,
				new: this.state.newPassword
			}, function(data) {
				if (data.status == "ok") {
					that.setState({
						loading: false,
						success: true
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
			this.submit();
		}
	}

	render(props, state) {
		if (state.success) {
			return <Modal title="Change password" openModal={props.openModal} class="changePasswordModal">
				<div class="modal-body">
					<p>Your password was changed successfully.</p>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" onClick={this.close.bind(this)}>Close</button>
				</div>
			</Modal>;
		}

		return <Modal title="Change password" openModal={props.openModal} noClose={state.loading} class="changePasswordModal">
			<div class="modal-body">
				{state.error && <div class="alert alert-danger">{state.error}</div>}

				<p>For confirmation purposes, enter your current password.</p>
				<input type="password" class="form-control changePasswordCurrent" placeholder="Current password" onKeyup={this.keyup.bind(this)} onInput={linkState(this, "currentPassword")} value={state.currentPassword} disabled={state.loading} />

				<div class="row">
					<div class="col-md-8">
						<p>Now, enter your new password. You must enter your new password twice to confirm that you didn't mistype it the first time. Passwords must follow the password guidelines on the right.</p>
						<input type="password" class="form-control" placeholder="New password" onKeyup={this.keyup.bind(this)} onInput={linkState(this, "newPassword")} value={state.newPassword} disabled={state.loading} />
						<input type="password" class="form-control" placeholder="New password (again)" onKeyup={this.keyup.bind(this)} onInput={linkState(this, "newPasswordConf")} value={state.newPasswordConf} disabled={state.loading} />
					</div>
					<div class="col-md-4">
						<PasswordSecurityCheck password={state.newPassword} />
					</div>
				</div>

			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-primary" onClick={this.submit.bind(this)} disabled={state.loading || checkPassword(state.newPassword).length != 0}>Change</button>
			</div>
		</Modal>;
	}
};