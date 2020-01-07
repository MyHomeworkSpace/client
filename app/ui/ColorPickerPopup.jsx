import "ui/ColorPickerPopup.styl";

import { h, Component } from "preact";

import consts from "consts.js";

export default class ColorPickerPopup extends Component {
	pickColor(color) {
		this.props.selectColor(color);
	}

	render(props, state) {
		var colorElements = consts.colors.map((color) => {
			return <div
				class={`colorPickerPopupColor ${props.value == color ? "selected" : ""}`}
				style={`background-color: #${color}`}
				onClick={this.pickColor.bind(this, color)}
			/>;
		});

		return <div class="pickerPopup colorPickerPopup">
			{colorElements}
		</div>;
	}
};