import "settings/panes/applications/MyApplicationDeleteModal.styl";
import Modal from "ui/Modal.jsx";

import { h, Component } from "preact";
import linkState from "linkstate";
import api from "api.js";

export default class MyApplicationDeleteModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			confirmPhrase: ""
		};
	}

	delete() {
		this.setState({
			loading: true,
		}, () => {
			api.post("application/manage/delete", {
				id: this.props.modalState.application.id
			}, () => {
				this.props.modalState.refresh(this.close.bind(this));
			});
		});

	}

	close() {
		this.props.openModal("");
	}

	render(props, state) {
		let confirmPhrase = "delete my application";

		return <Modal title="Delete application" openModal={props.openModal} close={this.close.bind(this)}>
			<div class="modal-body myApplicationDeleteModal">
				<div className="alert alert-danger"><strong>Read this entire message.</strong> Deleting this application may have unintended side effects. There is no confirmation screen after this dialog.</div>
				<p>You are deleting the application <strong>{props.modalState.application.name}</strong> (Application ID: <code>{props.modalState.application.id}</code>). <u>This action cannot be undone.</u></p>
				<p>Your Client ID and each of your authorization tokens will immediately be revoked, and your application's connection to MyHomeworkSpace will cease to function. You will be unable to recieve the same application ID again.</p>
				<p>If you understand these concequences and wish to continue, type <strong class="no-select">{confirmPhrase}</strong> in the box below, then click "Delete."</p>
				<input type="text" placeholder={confirmPhrase} class="form-control" onInput={linkState(this, "confirmPhrase")} />
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" onClick={this.close.bind(this)}>Cancel</button>
				<button type="button" class="btn btn-danger" disabled={confirmPhrase.toLowerCase() != state.confirmPhrase.toLowerCase()} onClick={this.delete.bind(this)}>Delete</button>
			</div>
		</Modal>;
	}
};