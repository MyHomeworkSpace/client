import "ui/ColorPicker.styl";

import { h, Component } from "preact";

import $ from "jquery";

import ColorPickerPopup from "ui/ColorPickerPopup.jsx";

class ColorPicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			bodyClick: this.onBodyClick.bind(this)
		};
	}

	onBodyClick(e) {
		if ($(e.target).closest(".colorPickerPopup").length == 0) {
			this.toggle();
		}
	}

	toggle(e) {
		if (e) {
			e.stopPropagation();
		}
		this.setState({
			open: !this.state.open
		}, function() {
			if (this.state.open) {
				$("body").bind("click", this.state.bodyClick);
			} else {
				$("body").unbind("click", this.state.bodyClick);
			}
		});
	}

	selectColor(color) {
		this.props.onChange(color);
		this.toggle();
	}

	render(props, state) {
		return <div class="colorPickerContainer">
			<div class="colorPicker" onClick={!state.open && this.toggle.bind(this)}>
				<div class="colorPickerOutput">
					<div class="colorPickerColor" style={`background-color:#${props.value}`} />
				</div>
				<div class="colorPickerAction"><i class={state.open ? "fa fa-chevron-circle-up" : "fa fa-chevron-circle-down"} /></div>
				<div class="colorPickerClear"></div>
			</div>
			{state.open && <ColorPickerPopup value={props.value} selectColor={this.selectColor.bind(this)} />}
		</div>;
	}
}

export default ColorPicker;