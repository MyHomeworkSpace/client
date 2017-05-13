import "calendar/CalendarEvent.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import $ from "jquery";

import HomeworkName from "ui/HomeworkName.jsx";

class CalendarEvent extends Component {
	click(e) {
		var calendarEvent = $(e.target).closest(".calendarEvent")[0];

		var rect = calendarEvent.getBoundingClientRect();
		
		var scrollContainer = calendarEvent.parentElement.parentElement.parentElement.parentElement;
		var scrollContainerRect = scrollContainer.getBoundingClientRect();
		var scrollOffset = scrollContainer.scrollTop;

		var top = scrollOffset + rect.top - scrollContainerRect.top;
		var left = rect.left + rect.width - scrollContainerRect.left;

		this.props.openPopover(top, left, this.props.type, this.props.item);
	}

	render(props, state) {
		var isScheduleItem = (props.type == "schedule");

		var dayStart = moment.unix(props.item.start).startOf("day");
		if (isScheduleItem) {
			dayStart = moment.unix(0).utc();
		}

		var start = moment.unix(props.item.start);
		var end = moment.unix(props.item.end);
		if (isScheduleItem) {
			start = start.utc();
			end = end.utc();
		}

		var offset = start.diff(dayStart, "minutes");
		var durationInMinutes = end.diff(start, "minutes");

		var startDisplay = start.format("h:mm a");
		var endDisplay = end.format("h:mm a");

		var displayName = (props.type == "homework" ? props.item.homework.name : props.item.name);

		if (isScheduleItem) {
			var displayNameSectionless = displayName.replace(/ -(.*)\(.*\)/g, "");
			displayName = displayNameSectionless.trim().split(":")[0].trim();
		}

		var groupWidth = 100 / props.groupLength;

		return <div class="calendarEventContainer">
			<div class="calendarEvent" style={`top: ${offset}px; left:${groupWidth*props.groupIndex}%; width: ${groupWidth}%; height: ${durationInMinutes}px;`} onClick={this.click.bind(this)}>
				<div class="calendarEventName">{props.type == "homework" ? <HomeworkName name={displayName} /> : displayName}</div>
				<div class="calendarEventTime">{startDisplay} to {endDisplay}</div>
			</div>
		</div>;
	}
}

export default CalendarEvent;