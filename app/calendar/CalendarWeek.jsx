import "calendar/CalendarWeek.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import CalendarEvents from "calendar/CalendarEvents.jsx";
import CalendarWeekDay from "calendar/CalendarWeekDay.jsx";

class CalendarWeek extends Component {
	render(props, state) {
		return <div class="calendarWeek">
			<div class="calendarWeekHeader">
				<CalendarWeekDay name="Monday" />
				<CalendarWeekDay name="Tuesday" />
				<CalendarWeekDay name="Wednesday" />
				<CalendarWeekDay name="Thursday" />
				<CalendarWeekDay name="Friday" />
			</div>

			<div class="calendarWeekEventsContainer">
				<CalendarEvents schedule={props.schedule} />
			</div>
		</div>;
	}
}

export default CalendarWeek;