import "calendar/CalendarWeekDay.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

class CalendarWeekDay extends Component {
	render(props, state) {
		return <div class="calendarWeekDay">
			<div class="calendarWeekDayName">
				{props.name} {props.day.format("M/D")}
			</div>
		</div>;
	}
}

export default CalendarWeekDay;