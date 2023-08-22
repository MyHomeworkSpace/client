import "calendar/CalendarEvent.styl";

import { h, Component } from "preact";

import moment from "moment";

import consts from "consts.js";
import { closestByClass } from "utils.js";

import ClassName from "ui/ClassName.jsx";
import HomeworkName from "ui/HomeworkName.jsx";

export default class CalendarEvent extends Component {
	click(e) {
		var calendarEvent = closestByClass(e.target, "calendarEvent");

		var rect = calendarEvent.getBoundingClientRect();

		var scrollContainer = calendarEvent.parentElement.parentElement.parentElement.parentElement;
		var scrollContainerRect = scrollContainer.getBoundingClientRect();
		var scrollOffset = scrollContainer.scrollTop;

		var top = scrollOffset + rect.top - scrollContainerRect.top;
		var left = rect.left + rect.width - scrollContainerRect.left;

		this.props.openPopover(top, left, this.props.type, this.props.item, this.props.groupLength);
	}

	render(props, state) {
		var dayStart = moment.unix(props.item.start).startOf("day");

		var start = moment.unix(props.item.start);
		var end = moment.unix(props.item.end);

		var offset = start.diff(dayStart, "minutes");
		var durationInMinutes = end.diff(start, "minutes");

		if (!dayStart.isDST() && start.isDST()) {
			offset += 60;
		}
		if (!start.isDST() && end.isDST()) {
			durationInMinutes += 60;
		}
		if (dayStart.isDST() && !start.isDST()) {
			offset -= 60;
		}
		if (start.isDST() && !end.isDST()) {
			durationInMinutes -= 60;
		}

		var startDisplay = start.format("h:mm a");
		var endDisplay = end.format("h:mm a");

		var displayName = props.item.name;

		if (props.item.tags[consts.EVENT_TAG_SHORT_NAME]) {
			displayName = props.item.tags[consts.EVENT_TAG_SHORT_NAME];
		}

		if (props.item.tags[consts.EVENT_TAG_IS_CONTINUATION]) {
			startDisplay = "...";
		}

		if (props.item.tags[consts.EVENT_TAG_CONTINUES]) {
			endDisplay = "...";
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

		var cancelled = props.item.tags[consts.EVENT_TAG_CANCELLED] || false;

		if (props.tiny) {
			return <div class={`calendarEvent calendarEventTiny ${cancelled ? "calendarEventCancelled" : ""}`} onClick={this.click.bind(this)}>
				<div class="calendarEventDurationLine"></div>
				<div class="calendarEventInfo">
					<span class="calendarEventTime">{startDisplay}</span>
					<span class="calendarEventName">{recurIcon}{props.item.tags[consts.EVENT_TAG_HOMEWORK] ? <HomeworkName name={displayName} /> : displayName}</span>
				</div>
			</div>;
		} else {
			const hideBuilding = props.item.tags[consts.EVENT_TAG_HIDE_BUILDING_NAME] || false;
			const showInText = (!hideBuilding && props.item.tags[consts.EVENT_TAG_BUILDING_NAME]) || props.item.tags[consts.EVENT_TAG_ROOM_NUMBER];

			return <div class="calendarEventContainer">
				<div class={`calendarEvent ${cancelled ? "calendarEventCancelled" : ""}`} style={`top: ${offset}px; left:${groupWidth * props.groupIndex}%; width: ${groupWidth}%; height: ${height}px;`} onClick={this.click.bind(this)}>
					<div class="calendarEventDurationLine" style={`height: ${durationInMinutes}px;`}></div>
					<div class="calendarEventName">{recurIcon}{props.item.tags[consts.EVENT_TAG_HOMEWORK] ? <HomeworkName name={displayName} /> : displayName}</div>
					{props.item.tags[consts.EVENT_TAG_HOMEWORK_CLASS] && <div class="calendarEventSubname"><ClassName classObject={props.item.tags[consts.EVENT_TAG_HOMEWORK_CLASS]} /></div>}
					{!cancelled && <div class="calendarEventTime">
						{startDisplay} to {endDisplay}
						{showInText && ` in ${!hideBuilding ? (props.item.tags[consts.EVENT_TAG_BUILDING_NAME] + " ") : ""}${props.item.tags[consts.EVENT_TAG_ROOM_NUMBER]}`}
						{props.item.tags[consts.EVENT_TAG_LOCATION] && ` at ${props.item.tags[consts.EVENT_TAG_LOCATION]}`}
					</div>}
					{cancelled && <div class="calendarEventTime">
						<i class="fa fa-ban" /> cancelled
					</div>}

					{props.relativeTime && <div class="calendarEventTime">
						{moment.unix(props.item.start).isBefore(moment(props.time)) && "started "} <strong>{start.from(moment(props.time))}</strong>
					</div>}
				</div>
			</div>;
		}
	}
};