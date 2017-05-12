import "ui/TimePicker.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import moment from "moment";

import TimePickerPopup from "ui/TimePickerPopup.jsx";

class TimePicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			bodyClick: this.onBodyClick.bind(this)
		};
	}

	onBodyClick(e) {
		if ($(e.target).closest(".timePickerPopup").length == 0) {
			this.toggle();
		}
	}

	toggle() {
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

	selectTime(time) {
		this.props.change(time);
	}

	render(props, state) {
		return <div class="timePickerContainer">
			<div class="timePicker" onClick={!state.open && this.toggle.bind(this)}>
				<div class="timePickerOutput">{props.value.format("h:mm a")}</div>
				<div class="timePickerAction"><i class={state.open ? "fa fa-chevron-up" : "fa fa-chevron-down"} /></div>
				<div class="timePickerClear"></div>
			</div>
			{state.open && <TimePickerPopup time={props.value} selectTime={this.selectTime.bind(this)} />}
		</div>;
	}
}

export default TimePicker;