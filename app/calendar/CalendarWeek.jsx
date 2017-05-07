import "calendar/CalendarWeek.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import CalendarEvents from "calendar/CalendarEvents.jsx";
import CalendarWeekDay from "calendar/CalendarWeekDay.jsx";

class CalendarWeek extends Component {
	render(props, state) {
		return <div class="calendarWeek">
			<div class="calendarWeekHeader">
				<CalendarWeekDay name="Monday" day={props.monday} />
				<CalendarWeekDay name="Tuesday" day={moment(props.monday).add(1, "day")} />
				<CalendarWeekDay name="Wednesday" day={moment(props.monday).add(2, "days")} />
				<CalendarWeekDay name="Thursday" day={moment(props.monday).add(3, "days")} />
				<CalendarWeekDay name={props.friday ? `Friday ${props.friday.index}` : "Friday"} day={moment(props.monday).add(4, "days")} />
				<CalendarWeekDay name="Saturday" day={moment(props.monday).add(5, "days")} />
				<CalendarWeekDay name="Sunday" day={moment(props.monday).add(6, "days")} />
			</div>

			<div class="calendarWeekEventsContainer">
				<CalendarEvents schedule={props.schedule} friday={props.friday} />
			</div>
		</div>;
	}
}

export default CalendarWeek;