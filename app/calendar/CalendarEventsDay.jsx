import "calendar/CalendarEventsDay.styl";

import { h, Component } from "preact";

import CalendarNowLine from "calendar/CalendarNowLine.jsx";

export default class CalendarEventsDay extends Component {
	render(props, state) {
		var isToday = props.day.isSame(props.today, "day");
		return <div class={`calendarEventsDay ${isToday ? "calendarEventsDayToday" : ""}`}>
			{isToday && <CalendarNowLine time={props.time} />}
			{props.children}
		</div>;
	}
};