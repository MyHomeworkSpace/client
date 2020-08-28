import "settings/panes/account/BackgroundModal.styl";

import { h, Component } from "preact";

import api from "api.js";
import { getImage, pingBeacon } from "daltontab.js";

import Modal from "ui/Modal.jsx";

export default class BackgroundModal extends Component {
	constructor(props) {
		super(props);

		this._colorTimeout = null;

		this.state = {
			color: "#00000",
			dailyBgLoading: true,
			dailyBgError: false,
			currentBg: props.currentBackground
		};

		if (props.currentBackground.indexOf("clr:") == 0) {
			this.state.color = props.currentBackground.replace("clr:", "");
		}

		this.loadDailyBg();
	}

	loadDailyBg() {
		getImage((imageData) => {
			if (imageData.status == "ok") {
				this.setState({
					dailyBgLoading: false,
					dailyBgData: imageData
				});
				pingBeacon();
			} else {
				this.setState({
					dailyBgLoading: false,
					dailyBgError: true
				});
			}
		});
	}

	close() {
		this.props.openModal("");
	}

	saveBackground(bg) {
		this.setState({
			currentBg: bg
		}, () => {
			api.post("prefs/set", {
				key: "background",
				value: bg
			}, function() { });
		});
	}

	onColorChange(e) {
		var bgStr = "clr:" + e.target.value;
		this.props.setBackground(bgStr);
		if (this._colorTimeout) {
			clearTimeout(this._colorTimeout);
		}
		this._colorTimeout = setTimeout(() => {
			this.saveBackground(bgStr);
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

				<h3>Image of the day</h3>
				<p>You can also use a rotating image of the day as your background.</p>
				{state.dailyBgError && <div class="alert alert-danger">The image of the day couldn't be loaded.</div>}
				{state.dailyBgLoading && <div><i class="fa fa-circle-o-notch fa-spin"></i> Loading ...</div>}
				{state.dailyBgData && <div class="row">
					<div class="col-md-5">
						<img src={state.dailyBgData.imgUrl} class="image-of-the-day" />
					</div>
					<div class="col-md-7">
						<h4>Today's background:</h4>
						<strong>{state.dailyBgData.description}</strong>
						<p>By <a href={state.dailyBgData.authorUrl}>{state.dailyBgData.authorName}</a></p>
						<p><em>Image from <a href={state.dailyBgData.siteUrl}>{state.dailyBgData.siteName}</a></em></p>
						<button class="btn btn-default" onClick={this.setBackgroundImage.bind(this, -1)} disabled={state.currentBg == "img:-1"}>
							{state.currentBg == "img:-1" ? "Selected" : "Select"}
						</button>
					</div>
				</div>}

				<h3>Color</h3>
				<p>You can also choose to have a solid background.</p>
				<input type="color" value={state.color} onChange={this.onColorChange.bind(this)} />
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" onClick={this.close.bind(this)}>Close</button>
			</div>
		</Modal>;
	}
};