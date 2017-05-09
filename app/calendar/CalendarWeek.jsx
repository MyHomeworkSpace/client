import "calendar/CalendarWeek.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import CalendarEvents from "calendar/CalendarEvents.jsx";
import CalendarWeekDay from "calendar/CalendarWeekDay.jsx";

class CalendarWeek extends Component {
	render(props, state) {
		return <div class="calendarWeek">
			<div class="calendarWeekHeader">
				<CalendarWeekDay announcements={props.announcements} name="Monday" day={props.monday} />
				<CalendarWeekDay announcements={props.announcements} name="Tuesday" day={moment(props.monday).add(1, "day")} />
				<CalendarWeekDay announcements={props.announcements} name="Wednesday" day={moment(props.monday).add(2, "days")} />
				<CalendarWeekDay announcements={props.announcements} name="Thursday" day={moment(props.monday).add(3, "days")} />
				<CalendarWeekDay announcements={props.announcements} name={props.friday ? `Friday ${props.friday.index}` : "Friday"} day={moment(props.monday).add(4, "days")} />
				<CalendarWeekDay announcements={props.announcements} name="Saturday" day={moment(props.monday).add(5, "days")} />
				<CalendarWeekDay announcements={props.announcements} name="Sunday" day={moment(props.monday).add(6, "days")} />
			</div>

			<div class="calendarWeekEventsContainer">
				<CalendarEvents schedule={props.schedule} friday={props.friday} />
			</div>
		</div>;
	}
}

export default CalendarWeek;