import "ui/TimePicker.styl";

import { h, Component } from "preact";

import moment from "moment";

import Picker from "ui/Picker.jsx";
import TimePickerPopup from "ui/TimePickerPopup.jsx";

export default class TimePicker extends Component {
	selectTime(time) {
		this.props.change(time);
	}

	setOpen(open) {
		this.setState({
			open: open
		});
	}

	onTextChange(text) {
		let newTime = moment(text, "hh:mm a");
		if (newTime._pf.charsLeftOver == 0) {
			// parsed correctly
			this.selectTime(newTime);
		}
	}

	render(props, state) {
		return <Picker editable display={props.value.format("h:mm a")} class="timePicker" open={state.open} setOpen={this.setOpen.bind(this)} onTextChange={this.onTextChange.bind(this)}>
			<TimePickerPopup time={props.value} selectTime={this.selectTime.bind(this)} setOpen={this.setOpen.bind(this)} suggestStart={props.suggestStart} />
		</Picker>;
	}
};