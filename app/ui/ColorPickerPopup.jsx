import "ui/ColorPickerPopup.styl";

import { h, Component } from "preact";

import consts from "consts.js";

class ColorPickerPopup extends Component {
	pickColor(color) {
		this.props.selectColor(color);
		
	}

	render(props, state) {
		var that = this;

		var colorElements = consts.colors.map(function(color) {
			return <div
				class={`ColorPickerPopupColor ${props.value == color ? "selected" : ""}`}
				style={`background-color:#${color}`}
				onClick={that.pickColor.bind(that, color)}
			/>;
		});

		return <div class="ColorPickerPopup">
			{colorElements}
		</div>;
	}
}

export default ColorPickerPopup;