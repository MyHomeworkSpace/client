import "ui/ColorPicker.styl";

import { h, Component } from "preact";

import ColorPickerPopup from "ui/ColorPickerPopup.jsx";
import Picker from "ui/Picker.jsx";

export default class ColorPicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false
		};
	}

	setOpen(open) {
		this.setState({
			open: open
		});
	}

	selectColor(color) {
		this.props.onChange(color);
		this.setOpen(false);
	}

	render(props, state) {
		return <Picker class="colorPicker" containerClass="colorPickerContainer" display={<div class="colorPickerColor" style={`background-color:#${props.value}`} />} open={state.open} setOpen={this.setOpen.bind(this)}>
			{state.open && <ColorPickerPopup value={props.value} selectColor={this.selectColor.bind(this)} />}
		</Picker>;
	}
};