import "ui/DatePickerCalendarGrid.styl";

import { h, Component } from "preact";

import moment from "moment";

export default class DatePickerCalendarGrid extends Component {
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
			<div class="datePickerCalendarGridItem datePickerCalendarGridHeader">Sun</div>
			<div class="datePickerCalendarGridItem datePickerCalendarGridHeader">Mon</div>
			<div class="datePickerCalendarGridItem datePickerCalendarGridHeader">Tue</div>
			<div class="datePickerCalendarGridItem datePickerCalendarGridHeader">Wed</div>
			<div class="datePickerCalendarGridItem datePickerCalendarGridHeader">Thu</div>
			<div class="datePickerCalendarGridItem datePickerCalendarGridHeader">Fri</div>
			<div class="datePickerCalendarGridItem datePickerCalendarGridHeader">Sat</div>
			{items}
		</div>;
	}
};