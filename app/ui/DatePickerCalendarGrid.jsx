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
			var offset = i - firstDay.day() + 1;

			var thisDay = moment(props.date).date(offset);
			items.push(<div class="datePickerCalendarGridItem datePickerCalendarGridItemDay datePickerCalendarGridItemDayExtra" onClick={this.selectDate.bind(this, offset)}>{thisDay.date()}</div>);
		}

		for (i = firstDay.date(); i <= lastDay.date(); i++) {
			var thisDay = moment(props.date).date(i);
			var isSelected = thisDay.isSame(props.currentDate, "day");
			var isToday = thisDay.isSame(today, "day");
			items.push(<div class={`datePickerCalendarGridItem datePickerCalendarGridItemDay ${isSelected ? "datePickerCalendarGridItemDaySelected" : ""} ${isToday ? "datePickerCalendarGridItemDayToday" : ""}`} onClick={this.selectDate.bind(this, i)}>{i}</div>);
		}

		for (var i = lastDay.day(); i < 6; i++) {
			// add spacers for days in next month
			var offset = i - lastDay.day() + 1;
			var date = lastDay.date() + offset;

			var thisDay = moment(props.date).date(date);
			items.push(<div class="datePickerCalendarGridItem datePickerCalendarGridItemDay datePickerCalendarGridItemDayExtra" onClick={this.selectDate.bind(this, date)}>{thisDay.date()}</div>);
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