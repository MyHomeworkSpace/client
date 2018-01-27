import "ui/TimePicker.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import moment from "moment";

import Picker from "ui/Picker.jsx";
import TimePickerPopup from "ui/TimePickerPopup.jsx";

class TimePicker extends Component {
	selectTime(time) {
		this.props.change(time);
	}

	setOpen(open) {
		this.setState({
			open: open
		});
	}

	render(props, state) {
		return <Picker display={props.value.format("h:mm a")} class="timePicker" open={state.open} setOpen={this.setOpen.bind(this)}>
			<TimePickerPopup time={props.value} selectTime={this.selectTime.bind(this)} />
		</Picker>;
	}
}

export default TimePicker;