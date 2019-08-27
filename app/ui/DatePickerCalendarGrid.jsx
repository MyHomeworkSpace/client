import "ui/DatePickerCalendarGrid.styl";

import { h, Component } from "preact";

import moment from "moment";

class DatePickerCalendarGrid extends Component {
	selectDate(day) {
		this.props.selectDate(moment(this.props.date).date(day));
	}

	render(props, state) {
		var firstDay = moment(props.date).startOf("month");
		var lastDay = moment(props.date).endOf("month");
		var today = moment();

		var items = [];
		for (var i = 0; i < firstDay.day(); i++) {
			// add spacers for days from last month
			items.push(<div class="datePickerCalendarGridItem"></div>);
		}

		for (i = firstDay.date(); i <= lastDay.date(); i++) {
			var thisDay = moment(props.date).date(i);
			var isSelected = thisDay.isSame(props.currentDate, "day");
			var isToday = thisDay.isSame(today, "day");
			items.push(<div class={`datePickerCalendarGridItem datePickerCalendarGridItemDay ${isSelected ? "datePickerCalendarGridItemDaySelected" : ""} ${isToday ? "datePickerCalendarGridItemDayToday" : ""}`} onClick={this.selectDate.bind(this, i)}>{i}</div>);
		}

		return <div class="datePickerCalendarGrid">
			<div class="datePickerCalendarGridItem">Sun</div>
			<div class="datePickerCalendarGridItem">Mon</div>
			<div class="datePickerCalendarGridItem">Tue</div>
			<div class="datePickerCalendarGridItem">Wed</div>
			<div class="datePickerCalendarGridItem">Thu</div>
			<div class="datePickerCalendarGridItem">Fri</div>
			<div class="datePickerCalendarGridItem">Sat</div>
			{items}
		</div>;
	}
}

export default DatePickerCalendarGrid;