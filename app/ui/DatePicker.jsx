import { h, Component } from "preact";
import linkState from "linkstate";

import moment from "moment";

import DatePickerCalendar from "ui/DatePickerCalendar.jsx";
import Picker from "ui/Picker.jsx";

export default class DatePicker extends Component {
	selectDate(date) {
		this.setState({
			open: false
		}, function() {
			this.props.change(date);
		});
	}

	setOpen(open) {
		this.setState({
			open: open
		});
	}

	render(props, state) {
		var format = props.format || "ddd, MMMM Do, YYYY";
		return <Picker display={props.value.format(format)} open={state.open} setOpen={this.setOpen.bind(this)}>
			<DatePickerCalendar date={props.value} selectDate={this.selectDate.bind(this)} />
		</Picker>;
	}
};