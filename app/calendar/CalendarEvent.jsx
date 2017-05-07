import "calendar/CalendarEvent.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

class CalendarEvent extends Component {
	click(e) {
		var rect = e.target.parentElement.getBoundingClientRect();
		
		var scrollContainer = e.target.parentElement.parentElement.parentElement.parentElement.parentElement;
		var scrollContainerRect = scrollContainer.getBoundingClientRect();
		var scrollOffset = scrollContainer.scrollTop;

		var top = scrollOffset + rect.top - scrollContainerRect.top;
		var left = rect.left + rect.width - scrollContainerRect.left;

		this.props.openPopover(top, left, this.props.type, this.props.item);
	}

	render(props, state) {
		var dayStart = moment.unix(0).utc();
		var start = moment.unix(props.item.start).utc();
		var end = moment.unix(props.item.end).utc();

		var offset = start.diff(dayStart, "minutes");
		var durationInMinutes = end.diff(start, "minutes");

		var startDisplay = start.format("h:mm a");
		var endDisplay = end.format("h:mm a");

		var isScheduleItem = (props.type == "schedule");

		var displayName = props.item.name;

		if (isScheduleItem) {
			displayName = displayName.split("-")[0].trim().split(":")[0].trim();
		}

		return <div class="calendarEventContainer">
			<div class="calendarEvent" style={`top: ${offset}px; height: ${durationInMinutes}px`} onClick={this.click.bind(this)}>
				<div class="calendarEventName">{displayName}</div>
				{isScheduleItem && <div class="calendarEventTeacher">{props.item.ownerName}</div>}
				<div class="calendarEventTime">{startDisplay} to {endDisplay}</div>
			</div>
		</div>;
	}
}

export default CalendarEvent;