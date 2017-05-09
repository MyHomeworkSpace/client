import "ui/DatePickerCalendar.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import DatePickerCalendarGrid from "ui/DatePickerCalendarGrid.jsx";

class DatePickerCalendar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			viewDate: props.date
		};
	}

	jumpMonth(amount) {
		this.setState({
			viewDate: moment(this.state.viewDate).add(amount, "month")
		});
	}

	render(props, state) {
		return <div class="datePickerCalendar">
			<div class="datePickerCalendarControls">
				<div class="datePickerCalendarControl">
					<button class="btn btn-default" onClick={this.jumpMonth.bind(this, -1)}><i class="fa fa-chevron-left"></i></button>
				</div>
				<div class="datePickerCalendarMonth">{state.viewDate.format("MMMM YYYY")}</div>
				<div class="datePickerCalendarControl">
					<button class="btn btn-default" onClick={this.jumpMonth.bind(this, 1)}><i class="fa fa-chevron-right"></i></button>
				</div>
			</div>
			<DatePickerCalendarGrid date={state.viewDate} currentDate={props.date} selectDate={props.selectDate} />
		</div>;
	}
}

export default DatePickerCalendar;