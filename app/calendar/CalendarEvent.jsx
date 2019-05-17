import "calendar/CalendarEvent.styl";

import { h, Component } from "preact";

import moment from "moment";

import consts from "consts.js";

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
		var dayStart = moment.unix(props.item.start).startOf("day");

		var start = moment.unix(props.item.start);
		var end = moment.unix(props.item.end);

		var offset = start.diff(dayStart, "minutes");
		var durationInMinutes = end.diff(start, "minutes");

		var startDisplay = start.format("h:mm a");
		var endDisplay = end.format("h:mm a");

		var displayName = (props.item.type == consts.EVENT_TYPE_HOMEWORK ? props.item.data.homework.name : props.item.name);

		if (props.item.type == consts.EVENT_TYPE_SCHEDULE) {
			var displayNameSectionless = displayName.replace(/ -(.*)\(.*\)/g, "");
			displayName = displayNameSectionless.trim();
		}

		var groupWidth = 100 / props.groupLength;
		var height = durationInMinutes;
		if (height < 10) {
			height = 10;
		}

		var recurIcon;
		if (props.item.recurRule) {
			recurIcon = <i class="fa fa-refresh calendarEventRecur" />;
		}

		if (props.tiny) {
			return <div class="calendarEvent calendarEventTiny" onClick={this.click.bind(this)}>
				<div class="calendarEventDurationLine"></div>
				<div class="calendarEventInfo">
					<span class="calendarEventTime">{startDisplay}</span>
					<span class="calendarEventName">{recurIcon}{props.item.type == consts.EVENT_TYPE_HOMEWORK ? <HomeworkName name={displayName} /> : displayName}</span>
				</div>
			</div>;
		} else {
			return <div class="calendarEventContainer">
				<div class="calendarEvent" style={`top: ${offset}px; left:${groupWidth*props.groupIndex}%; width: ${groupWidth}%; height: ${height}px;`} onClick={this.click.bind(this)}>
					<div class="calendarEventDurationLine" style={`height: ${durationInMinutes}px;`}></div>
					<div class="calendarEventName">{recurIcon}{props.item.type == consts.EVENT_TYPE_HOMEWORK ? <HomeworkName name={displayName} /> : displayName}</div>
					<div class="calendarEventTime">{startDisplay} to {endDisplay}{(props.item.type == consts.EVENT_TYPE_SCHEDULE && props.item.data.roomNumber) ? ` in ${props.item.data.roomNumber}` : ""}</div>
				</div>
			</div>;
		}
	}
}

export default CalendarEvent;