import "settings/BackgroundModal.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";

import LoadingIndicator from "ui/LoadingIndicator.jsx";
import Modal from "ui/Modal.jsx";

class BackgroundModal extends Component {
	constructor() {
		super();
		this._colorTimeout = null;
		this.state = {
			color: "#00000"
		};
	}

	componentWillMount() {
		if (this.props.currentBackground.indexOf("clr:") == 0) {
			this.setState({
				color: this.props.currentBackground.replace("clr:", "")
			});
		}
	}

	close() {
		this.props.openModal("");
	}

	saveBackground(bg) {
		api.post("prefs/set", {
			key: "background",
			value: bg
		}, function(xhr) {

		});
	}

	onColorChange(e) {
		var bgStr = "clr:" + e.target.value;
		this.props.setBackground(bgStr);
		if (this._colorTimeout) {
			clearTimeout(this._colorTimeout);
		}
		var that = this;
		this._colorTimeout = setTimeout(function() {
			that.saveBackground(bgStr);
		}, 300);
	}
	
	setBackgroundImage(index) {
		this.props.setBackground("img:" + index);
		this.saveBackground("img:" + index);
	}

	render(props, state) {
		var backgroundCount = 10;
		var backgroundImages = [];

		for (var i = 0; i < backgroundCount; i++) {
			backgroundImages.push(<img src={`img/backgrounds/bg${i + 1}_thumb.jpg`} onClick={this.setBackgroundImage.bind(this, i + 1)} />);
		}

		return <Modal title="Set background" openModal={props.openModal} class="backgroundModal">
			<div class="modal-body">
				<h3>Image</h3>
				<div class="backgroundImages">
					{backgroundImages}
				</div>
				
				<h3>Color</h3>
				<p>You can also choose to have a solid background.</p>
				<input type="color" value={state.color} onChange={this.onColorChange.bind(this)} />
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" onClick={this.close.bind(this)}>Close</button>
			</div>
		</Modal>;
	}
}

export default BackgroundModal;