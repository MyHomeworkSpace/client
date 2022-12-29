import Modal from "ui/Modal.jsx";

import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";
import errors from "errors.js";

export default class MyApplicationDeleteModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			error: "",

			name: props.modalState.application.name,
			callbackUrl: props.modalState.application.callbackUrl,
			confirmPhrase: ""
		};
	}

	save() {
		if (!this.state.name) {
			this.setState({
				error: "You must enter a name for the application!"
			});
			return;
		}
		if (!this.state.callbackUrl) {
			this.setState({
				error: "You must enter a callback URL for the application!"
			});
			return;
		}

		this.setState({
			loading: true,
			error: ""
		}, () => {
			api.post("application/manage/update", {
				id: this.props.modalState.application.id,
				name: this.state.name,
				callbackUrl: this.state.callbackUrl,
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

	keyup(e) {
		if (e.keyCode == 13) {
			this.save();
		}
	}

	render(props, state) {
		return <Modal title="Update application" openModal={props.openModal} close={this.close.bind(this)}>
			<div class="modal-body">
				{state.error && <div class="alert alert-danger">{state.error}</div>}

				<div class="form-group">
					<label>Name</label>
					<input value={state.name} class="form-control" type="text" placeholder="My Super Cool Application" onChange={linkState(this, "name")} onKeyUp={this.keyup.bind(this)} />
					<p class="help-block">A name for your application. This will be shown to users, along with your name. Keep it short and sweet.</p>
				</div>
				<div class="form-group">
					<label>Callback URI</label>
					<input value={state.callbackUrl} class="form-control" type="uri" placeholder="https://example.com/myhomeworkspace/callback" onChange={linkState(this, "callbackUrl")} onKeyup={this.keyup.bind(this)} />
					<p class="help-block">The callback URI for your application. Check out our <a href="https://support.myhomework.space/docs/get-started-api" target="_blank" rel="noopener noreferrer">documentation</a> for more information.</p>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" onClick={this.close.bind(this)}>Cancel</button>
				<button type="button" class="btn btn-primary" onClick={this.save.bind(this)}>Save</button>
			</div>
		</Modal >;
	}
};