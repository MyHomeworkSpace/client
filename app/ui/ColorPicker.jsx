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
		if ($(e.target).closest(".ColorPickerPopup").length == 0) {
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
		return <div class="ColorPickerContainer">
			<div class="ColorPicker" onClick={!state.open && this.toggle.bind(this)}>
				<div class="ColorPickerOutput">
					<div class="ColorPickerColor" style={`background-color:#${props.value}`} />
				</div>
				<div class="ColorPickerAction"><i class={state.open ? "fa fa-chevron-circle-up" : "fa fa-chevron-circle-down"} /></div>
				<div class="ColorPickerClear"></div>
			</div>
			{state.open && <ColorPickerPopup value={props.value} selectColor={this.selectColor.bind(this)} />}
		</div>;
	}
}

export default ColorPicker;