import "classes/ClassColorPickerPopup.styl";

import { h, Component } from "preact";

import consts from "consts.js";

class ClassColorPickerPopup extends Component {
	pickColor(color) {
		this.props.selectColor(color);
	}

	render(props, state) {
		var that = this;

		var colorElements = consts.classColors.map(function(color) {
			return <div
				class={`classColorPickerPopupColor ${props.value == color ? "selected" : ""}`}
				style={`background-color:#${color}`}
				onClick={that.pickColor.bind(that, color)}
			/>;
		});

		return <div class="classColorPickerPopup">
			{colorElements}
		</div>;
	}
}

export default ClassColorPickerPopup;