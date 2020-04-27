import { h, Component } from "preact";
import linkState from "linkstate";
import api from "api.js";

import Modal from "ui/Modal.jsx";

export default class ChangeNameModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name: MyHomeworkSpace.me.name,
			loading: false
		};
	}

	keyup(e) {
		if (e.keyCode == 13) {
			this.save();
		}
	}

	save() {
		let that = this;

		this.setState({
			loading: true,
		}, function() {
			api.post("auth/changeName", {
				new: that.state.name
			}, function() {
				that.props.refreshContext(that.close.bind(that));
			});
		});
	}

	close() {
		this.props.openModal("");
	}

	render(props, state) {
		return <Modal title="Change name" openModal={props.openModal} close={this.close.bind(this)}>
			<div class="modal-body">
				<p>Enter your new name.</p>
				<input type="text" class="form-control" placeholder="New name" onKeyup={this.keyup.bind(this)} onChange={linkState(this, "name")} value={state.name} disabled={state.loading} />
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-primary" disabled={state.loading} onClick={this.save.bind(this)}>Save</button>
			</div>
		</Modal>;
	}
};