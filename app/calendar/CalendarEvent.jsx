import "calendar/CalendarEvent.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

class CalendarEvent extends Component {
	render(props, state) {
		var dayStart = moment.unix(0);
		var start = moment.unix(props.item.start);
		var end = moment.unix(props.item.end);

		var offset = start.diff(dayStart, "minutes");
		var durationInMinutes = end.diff(start, "minutes");

		return <div class="calendarEvent" style={`top: ${offset}px; height: ${durationInMinutes}px`}>
			{props.item.name}
		</div>;
	}
}

export default CalendarEvent;