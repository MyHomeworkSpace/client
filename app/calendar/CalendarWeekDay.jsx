import "calendar/CalendarWeekDay.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

class CalendarWeekDay extends Component {
	render(props, state) {
		return <div class="calendarWeekDay">
			<div class="calendarWeekDayName">
				<span class="calendarWeekDayNameDow">{props.name}</span>
				<span class="calendarWeekDayNameDate">{props.day.format("M/D")}</span>
			</div>
		</div>;
	}
}

export default CalendarWeekDay;