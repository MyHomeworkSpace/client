import "settings/panes/tags/AddPrefix.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";
import errors from "errors.js";

import ColorPicker from "ui/ColorPicker.jsx";

export default class AddPrefix extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			background: "FF4086",
			words: ""
		};
	}

	addPrefix() {
		if (this.state.words.trim() == "") {
			this.setState({
				loading: false,
				error: "You must enter a tag name!"
			});
			return;
		}

		this.setState({
			loading: true
		}, () => {
			api.post("prefixes/add", {
				background: this.state.background,
				color: this.calculateTextColor(this.state.background),
				words: JSON.stringify(this.state.words.split(" ")),
				timedEvent: false
			}, (data) => {
				if (data.status == "ok") {
					this.props.refreshContext(() => {
						this.setState({
							loading: false,
							words: ""
						});
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
			this.addPrefix();
		}
	}

	changeBackgroundColor(background) {
		this.setState({
			background: background
		});
	}

	relativeLuminance(color) {
		// see https://www.w3.org/TR/WCAG21/#dfn-relative-luminance, assume sRGB
		var factors = [0.2126, 0.7152, 0.0722];
		var total = 0;
		[color.r, color.g, color.b].map((channel, i) => {
			var scaled = channel / 255;
			var intermediate;
			if (scaled <= 0.03928) {
				intermediate = scaled / 12.92;
			} else {
				intermediate = Math.pow((scaled + 0.055) / 1.055, 2.4);
			}
			total += intermediate*factors[i];
		});
		return total;
	}

	constrastRatio(colorA, colorB) {
		// see https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
		var luminanceA = this.relativeLuminance(colorA);
		var luminanceB = this.relativeLuminance(colorB);
		var L1 = (luminanceA > luminanceB ? luminanceA : luminanceB);
		var L2 = (luminanceA < luminanceB ? luminanceA : luminanceB);
		return (L1 + 0.05) / (L2 + 0.05);
	}

	calculateTextColor(colorStr) {
		var color = this.hexToRgb(colorStr);
		var contrastRatioWhite = this.constrastRatio(color, {r: 255, g: 255, b: 255});
		if (contrastRatioWhite > 1.5) {
			// it's a low standard, but it's what we need to be consistent with the default tags
			return "FFFFFF";
		}
		return "000000";
	}

	hexToRgb(hex) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	}

	render(props, state) {
		return <div class="addPrefix">
			{state.error && <div class="alert alert-danger">{state.error}</div>}

			<ColorPicker disabled={state.loading} onChange={this.changeBackgroundColor.bind(this)} value={state.background} />
			<input type="text" placeholder="Tags" disabled={state.loading} class="addPrefixWords form-control" onKeyUp={this.keyup.bind(this)} onChange={linkState(this, "words")} value={state.words} />
			<button class="btn btn-primary" disabled={state.loading} onClick={this.addPrefix.bind(this)}><i class="fa fa-fw fa-check" /></button>
			<button class="btn btn-danger" onClick={props.cancelAddPrefix}><i class="fa fa-fw fa-times" /></button>
		</div>;
	}
};