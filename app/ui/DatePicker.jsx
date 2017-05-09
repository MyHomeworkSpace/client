import "ui/DatePicker.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import moment from "moment";

import DatePickerCalendar from "ui/DatePickerCalendar.jsx";

class DatePicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			date: moment(),
			open: false
		};
	}

	toggle() {
		this.setState({
			open: !this.state.open
		});
	}

	selectDate(date) {
		this.setState({
			date: date,
			open: false
		});
	}

	render(props, state) {
		return <div class="datePickerContainer">
			<div class="datePicker" onClick={this.toggle.bind(this)}>
				<div class="datePickerOutput">{state.date.format("ddd, MMMM Do, YYYY")}</div>
				<div class="datePickerAction"><i class={state.open ? "fa fa-chevron-up" : "fa fa-chevron-down"} /></div>
				<div class="datePickerClear"></div>
			</div>
			{state.open && <DatePickerCalendar date={state.date} selectDate={this.selectDate.bind(this)} />}
		</div>;
	}
}

export default DatePicker;