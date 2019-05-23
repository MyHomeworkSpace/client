import "calendar/CalendarWeekDay.styl";

import { h, Component } from "preact";

class CalendarWeekDay extends Component {
	render(props, state) {
		return <div class="calendarWeekDay">
			<div class={`calendarWeekDayName ${props.day.isBefore(props.time, "day") ? "calendarWeekDayPast" : ""} ${props.day.isSame(props.time, "day") ? "calendarWeekDayToday" : ""}`}>
				<span class="calendarWeekDayNameDow">{props.name}</span>
				<span class="calendarWeekDayNameDate">{props.day.format("M/D")}</span>
			</div>
			{props.announcements && props.announcements.map(function(announcement) {
				return <div class="calendarWeekDayAnnouncement">
					{announcement.text}
				</div>;
			})}
		</div>;
	}
}

export default CalendarWeekDay;