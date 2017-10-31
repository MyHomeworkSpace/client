import "classes/ClassColorPicker.styl";

import { h, Component } from "preact";

import $ from "jquery";

import ClassColorPickerPopup from "classes/ClassColorPickerPopup.jsx";

class ClassColorPicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			bodyClick: this.onBodyClick.bind(this)
		};
	}

	onBodyClick(e) {
		if ($(e.target).closest(".classColorPickerPopup").length == 0) {
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
		return <div class="classColorPickerContainer">
			<div class="classColorPicker" onClick={!state.open && this.toggle.bind(this)}>
				<div class="classColorPickerOutput">
					<div class="classColorPickerColor" style={`background-color:#${props.value}`} />
				</div>
				<div class="classColorPickerAction"><i class={state.open ? "fa fa-chevron-circle-up" : "fa fa-chevron-circle-down"} /></div>
				<div class="classColorPickerClear"></div>
			</div>
			{state.open && <ClassColorPickerPopup value={props.value} selectColor={this.selectColor.bind(this)} />}
		</div>;
	}
}

export default ClassColorPicker;