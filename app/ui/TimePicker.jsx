import "ui/TimePicker.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import moment from "moment";

import TimePickerPopup from "ui/TimePickerPopup.jsx";

class TimePicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false
		};
	}

	toggle() {
		this.setState({
			open: !this.state.open
		});
	}

	selectTime(time) {
		this.props.change(time);
	}

	render(props, state) {
		return <div class="timePickerContainer">
			<div class="timePicker" onClick={this.toggle.bind(this)}>
				<div class="timePickerOutput">{props.value.format("h:mm a")}</div>
				<div class="timePickerAction"><i class={state.open ? "fa fa-chevron-up" : "fa fa-chevron-down"} /></div>
				<div class="timePickerClear"></div>
			</div>
			{state.open && <TimePickerPopup time={props.value} selectTime={this.selectTime.bind(this)} />}
		</div>;
	}
}

export default TimePicker;