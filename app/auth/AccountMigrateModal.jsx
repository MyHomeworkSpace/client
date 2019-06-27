import "auth/AccountMigrateModal.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import Modal from "ui/Modal.jsx";

export default class AccountMigrateModal extends Component {
	close() {
		this.props.openModal("");
	}

	changeEmail(e) {
		e.preventDefault();
		this.props.openModal("changeEmail");
	}	

	render(props, state) {
		var username;
		
		if (props.me.email) {
			username = props.me.email.replace("@dalton.org", "");
		} else {
			username = props.modalState.username;
		}

		return <Modal class="accountMigrateModal" title="Changes to MyHomeworkSpace" openModal={props.openModal} noClose={state.loading}>
			<div class="modal-body">
				<div class="accountMigrateHeader">Your Dalton account has been converted to a MyHomeworkSpace account.</div>
				<div>All your data is still here, and everything works the same way.</div>
				<div>When you sign in, make sure to use your @dalton.org email.</div>
				<div class="accountMigrateCompare row">
					<div class="col-md-6">
						{username}
						<div class="accountMigrateIncorrect"><i class="fa fa-fw fa-times" /> Incorrect</div>
					</div>
					<div class="col-md-6">
						{username}@dalton.org
						<div class="accountMigrateCorrect"><i class="fa fa-fw fa-check" /> Correct</div>
					</div>
				</div>
				{props.me.email && <div>If you'd like, you can <a href="#" onClick={this.changeEmail.bind(this)}>change the email</a> used for your account.</div>}
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-primary" onClick={this.close.bind(this)}>Close</button>
			</div>
		</Modal>;
	}
};