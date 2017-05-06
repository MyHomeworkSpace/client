import "calendar/CalendarEvent.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

class CalendarEvent extends Component {
	render(props, state) {
		var dayStart = moment("00:00:00", "HH:mm:ss");
		var start = moment(props.item.start, "HH:mm:ss");
		var end = moment(props.item.end, "HH:mm:ss");

		var offset = start.diff(dayStart, "minutes");
		var durationInMinutes = end.diff(start, "minutes");

		return <div class="calendarEvent" style={`top: ${offset}px; height: ${durationInMinutes}px`}>
			{props.item.name}
		</div>;
	}
}

export default CalendarEvent;