import "settings/panes/account/BackgroundModal.styl";

import { h, Component } from "preact";
import linkState from "linkstate";
import api from "api.js";

import Modal from "ui/Modal.jsx";

export default class BackgroundModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name: props.me.name,
			loading: false
		};
	}

	setBackgroundImage(index) {
		this.props.setBackground("img:" + index);
		this.saveBackground("img:" + index);
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
		var backgroundCount = 10;
		var backgroundImages = [];

		for (var i = 0; i < backgroundCount; i++) {
			backgroundImages.push(<img src={`img/backgrounds/bg${i + 1}_thumb.jpg`} onClick={this.setBackgroundImage.bind(this, i + 1)} />);
		}

		return <Modal title="Change name" openModal={props.openModal} close={this.close.bind(this)}>
			<div class="modal-body">
				<p>Enter your new name.</p>
				<input type="text" class="form-control" placeholder="New name" onKeyup={this.keyup.bind(this)} onChange={linkState(this, "name")} value={state.name} disabled={state.loading} />
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" disabled={state.loading} onClick={this.close.bind(this)}>Close</button>
				<button type="button" class="btn btn-primary" disabled={state.loading} onClick={this.save.bind(this)}>Save</button>
			</div>
		</Modal>;
	}
};