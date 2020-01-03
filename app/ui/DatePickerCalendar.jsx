import "ui/DatePickerCalendar.styl";

import { h, Component } from "preact";

import moment from "moment";

import DatePickerCalendarGrid from "ui/DatePickerCalendarGrid.jsx";

export default class DatePickerCalendar extends Component {
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

	today() {
		this.props.selectDate(moment());
	}

	render(props, state) {
		return <div class="datePickerCalendar">
			<div class="datePickerCalendarControls">
				<div class="datePickerCalendarControl left">
					<button class="btn btn-default" onClick={this.jumpMonth.bind(this, -1)}><i class="fa fa-chevron-left"></i></button>
				</div>
				<div class="datePickerCalendarMonth">{state.viewDate.format("MMMM YYYY")}</div>
				<div class="datePickerCalendarControl right">
					<button class="btn btn-default" onClick={this.jumpMonth.bind(this, 1)}><i class="fa fa-chevron-right"></i></button>
				</div>
			</div>
			<DatePickerCalendarGrid date={state.viewDate} currentDate={props.date} selectDate={props.selectDate} />
			<button class="btn btn-default btn-sm datePickerCalendarToday" onClick={this.today.bind(this)}>Today</button>
		</div>;
	}
};