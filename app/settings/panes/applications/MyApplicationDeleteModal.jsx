import "settings/panes/applications/MyApplicationDeleteModal.styl";
import Modal from "ui/Modal.jsx";

import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";
import errors from "errors.js";

const confirmPhrase = "delete my application";

export default class MyApplicationDeleteModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			error: "",

			confirmPhrase: ""
		};
	}

	delete() {
		this.setState({
			loading: true,
		}, () => {
			api.post("application/manage/delete", {
				id: this.props.modalState.application.id
			}, (data) => {
				if (data.status == "ok") {
					this.props.modalState.refresh(this.close.bind(this));
				} else {
					this.setState({
						loading: false,
						error: errors.getFriendlyString(data.error)
					});
				}
			});
		});
	}

	close() {
		this.props.openModal("");
	}

	canDelete() {
		return confirmPhrase.toLowerCase() == this.state.confirmPhrase.toLowerCase();
	}

	keyup(e) {
		if (this.canDelete() && e.keyCode == 13) {
			this.delete();
		}
	}

	render(props, state) {
		return <Modal title="Delete application" openModal={props.openModal} close={this.close.bind(this)}>
			<div class="modal-body myApplicationDeleteModal">
				{state.error && <div class="alert alert-danger">{state.error}</div>}

				<div class="alert alert-danger"><strong>Read this entire message.</strong> Deleting this application may have unintended side effects. There is no confirmation screen after this dialog.</div>
				<p>You are deleting the application <strong>{props.modalState.application.name}</strong> (Application ID: <code>{props.modalState.application.id}</code>). <u>This action cannot be undone.</u></p>
				<p>Your Client ID and each of your authorization tokens will immediately be revoked, and your application's connection to MyHomeworkSpace will cease to function. You will be unable to receive the same application ID again.</p>
				<p>If you understand these consequences and wish to continue, type <strong class="no-select">{confirmPhrase}</strong> in the box below, then click "Delete."</p>
				<input type="text" placeholder={confirmPhrase} class="form-control" onInput={linkState(this, "confirmPhrase")} onKeyUp={this.keyup.bind(this)} />
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" onClick={this.close.bind(this)}>Cancel</button>
				<button type="button" class="btn btn-danger" disabled={!this.canDelete()} onClick={this.delete.bind(this)}>Delete</button>
			</div>
		</Modal>;
	}
};