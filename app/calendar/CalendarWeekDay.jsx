import "calendar/CalendarWeekDay.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

class CalendarWeekDay extends Component {
	render(props, state) {
		var thisAnnouncement;
		props.announcements.forEach(function(announcement) {
			if (announcement.date == props.day.format("YYYY-MM-DD")) {
				thisAnnouncement = announcement;
			}
		});
		return <div class="calendarWeekDay">
			<div class="calendarWeekDayName">
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