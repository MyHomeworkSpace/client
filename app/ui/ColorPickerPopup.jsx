import "ui/ColorPickerPopup.styl";

import { h, Component, createRef } from "preact";

import consts from "consts.js";

export default class ColorPickerPopup extends Component {
	constructor(props) {
		super(props);

		this.customColorPicker = createRef();
	}

	pickColor(color) {
		this.props.selectColor(color);
	}

	pickCustomColor(event) {
		this.props.selectColor(event.target.value.substr(1)); //we need to get rid of the #
	}

	openCustomPicker() {
		this.customColorPicker.current.click();
	}

	render(props, state) {
		let colorElements = consts.colors.map((color) => {
			return <div
				class={`colorPickerPopupColor ${props.value == color ? "selected" : ""}`}
				style={`background-color: #${color}`}
				onClick={this.pickColor.bind(this, color)}
			/>;
		});

		const isCustomColor = !consts.colors.includes(props.value);

		return <div class="pickerPopup colorPickerPopup">
			{colorElements}
			<div
				class={`colorPickerPopupColor customColorSwatch ${isCustomColor ? "selected" : ""}`}
				style={isCustomColor ? `background-color: ${props.value}` : ""}
				onClick={this.openCustomPicker.bind(this)}>
				&bull;&bull;&bull;
				<input type="color"
					ref={this.customColorPicker}
					onChange={this.pickCustomColor.bind(this)}
					class="customColor" />
			</div>
		</div>;
	}
};