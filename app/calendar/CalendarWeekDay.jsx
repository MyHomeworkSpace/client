import "calendar/CalendarWeekDay.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

class CalendarWeekDay extends Component {
	render(props, state) {
		var thisAnnouncement;
		if (props.announcement) {
			props.announcements.forEach(function(announcement) {
				if (announcement.date == props.day.format("YYYY-MM-DD")) {
					thisAnnouncement = announcement;
				}
			});
		}
		return <div class="calendarWeekDay">
			<div class={`calendarWeekDayName ${props.day.isBefore(props.time, "day") ? "calendarWeekDayPast" : ""} ${props.day.isSame(props.time, "day") ? "calendarWeekDayToday" : ""}`}>
				<span class="calendarWeekDayNameDow">{props.name}</span>
				<span class="calendarWeekDayNameDate">{props.day.format("M/D")}</span>
			</div>
			{thisAnnouncement && <div class="calendarWeekDayAnnouncement">
				{thisAnnouncement.text}
			</div>}
		</div>;
	}
}

export default CalendarWeekDay;