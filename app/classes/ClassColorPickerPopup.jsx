import "classes/ClassColorPickerPopup.styl";

import { h, Component } from "preact";

var colors = [
	"ff4d40",
	"ffa540",
	"40ff73",
	"4071ff",
	"ff4086",
	"40ccff",
	"5940ff",
	"ff40f5",
	"a940ff",
	"e6ab68",
	"4d4d4d"
];

class ClassColorPickerPopup extends Component {
	pickColor(color) {
		this.props.selectColor(color);
	}

	render(props, state) {
		var that = this;

		var colorElements = colors.map(function(color) {
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