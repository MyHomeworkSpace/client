import "ui/DatePickerCalendarGrid.styl";

import { h, Component } from "preact";

import moment from "moment";

export default class DatePickerCalendarGrid extends Component {
	selectDate(day) {
		this.props.selectDate(moment(this.props.date).date(day));
	}

	render(props, state) {
		const firstDay = moment(props.date).startOf("month");
		const lastDay = moment(props.date).endOf("month");
		const today = moment();

		const items = [];
		for (var i = 0; i < firstDay.day(); i++) {
			// add spacers for days from last month
			const offset = i - firstDay.day() + 1;

			const thisDay = moment(props.date).date(offset);
			items.push(<div class="datePickerCalendarGridItem datePickerCalendarGridItemDay datePickerCalendarGridItemDayExtra" onClick={this.selectDate.bind(this, offset)}>{thisDay.date()}</div>);
		}

		for (i = firstDay.date(); i <= lastDay.date(); i++) {
			const thisDay = moment(props.date).date(i);
			const isSelected = thisDay.isSame(props.currentDate, "day");
			const isToday = thisDay.isSame(today, "day");
			items.push(<div class={`datePickerCalendarGridItem datePickerCalendarGridItemDay ${isSelected ? "datePickerCalendarGridItemDaySelected" : ""} ${isToday ? "datePickerCalendarGridItemDayToday" : ""}`} onClick={this.selectDate.bind(this, i)}>{i}</div>);
		}

		for (i = lastDay.day(); i < 6; i++) {
			// add spacers for days in next month
			const offset = i - lastDay.day() + 1;
			const date = lastDay.date() + offset;

			const thisDay = moment(props.date).date(date);
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