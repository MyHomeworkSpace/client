import "calendar/CalendarEventPopover.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

class CalendarEventPopover extends Component {
	render(props, state) {
		var info;

		var start = moment.unix(props.item.start).utc();
		var end = moment.unix(props.item.end).utc();
		var startDisplay = start.format("h:mm a");
		var endDisplay = end.format("h:mm a");

		if (props.type == "schedule") {
			info = <div class="calendarEventPopoverInfo">
				{props.item.ownerName}
			</div>;
		}

		return <div class="calendarEventPopover" style={`top: ${props.top}px; left: ${props.left + 5}px`}>
			<div class="calendarEventPopoverName">{props.item.name}</div>
			{info}
			<div class="calendarEventPopoverTime">{startDisplay} to {endDisplay}</div>
			{props.type == "schedule" && <div class="calendarEventPopoverOrigin"><i class="fa fa-clock-o" /> from your schedule</div>}
		</div>;
	}
}

export default CalendarEventPopover;