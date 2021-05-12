import "calendar/CalendarEvent.styl";

import { h, Component } from "preact";

import moment from "moment";

import consts from "consts.js";
import { closestByClass } from "utils.js";

import HomeworkName from "ui/HomeworkName.jsx";

export default class CalendarEvent extends Component {
	click(e) {
		let calendarEvent = closestByClass(e.target, "calendarEvent");

		let rect = calendarEvent.getBoundingClientRect();

		let scrollContainer = calendarEvent.parentElement.parentElement.parentElement.parentElement;
		let scrollContainerRect = scrollContainer.getBoundingClientRect();
		let scrollOffset = scrollContainer.scrollTop;

		let top = scrollOffset + rect.top - scrollContainerRect.top;
		let left = rect.left + rect.width - scrollContainerRect.left;

		this.props.openPopover(top, left, this.props.type, this.props.item, this.props.groupLength);
	}

	render(props, state) {
		let dayStart = moment.unix(props.item.start).startOf("day");

		let start = moment.unix(props.item.start);
		let end = moment.unix(props.item.end);

		let offset = start.diff(dayStart, "minutes");
		let durationInMinutes = end.diff(start, "minutes");

		if (!dayStart.isDST() && start.isDST()) {
			offset += 60;
		}
		if (!start.isDST() && end.isDST()) {
			durationInMinutes += 60;
		}

		let startDisplay = start.format("h:mm a");
		let endDisplay = end.format("h:mm a");

		let displayName = props.item.name;

		if (props.item.tags[consts.EVENT_TAG_SHORT_NAME]) {
			displayName = props.item.tags[consts.EVENT_TAG_SHORT_NAME];
		}

		let groupWidth = 100 / props.groupLength;
		let height = durationInMinutes;
		if (height < 10) {
			height = 10;
		}

		let recurIcon;
		if (props.item.recurRule) {
			recurIcon = <i class="fa fa-refresh calendarEventRecur" />;
		}

		let cancelled = props.item.tags[consts.EVENT_TAG_CANCELLED] || false;

		if (props.tiny) {
			return <div class={`calendarEvent calendarEventTiny ${cancelled ? "calendarEventCancelled" : ""}`} onClick={this.click.bind(this)}>
				<div class="calendarEventDurationLine"></div>
				<div class="calendarEventInfo">
					<span class="calendarEventTime">{startDisplay}</span>
					<span class="calendarEventName">{recurIcon}{props.item.tags[consts.EVENT_TAG_HOMEWORK] ? <HomeworkName name={displayName} /> : displayName}</span>
				</div>
			</div>;
		} else {
			return <div class="calendarEventContainer">
				<div class={`calendarEvent ${cancelled ? "calendarEventCancelled" : ""}`} style={`top: ${offset}px; left:${groupWidth * props.groupIndex}%; width: ${groupWidth}%; height: ${height}px;`} onClick={this.click.bind(this)}>
					<div class="calendarEventDurationLine" style={`height: ${durationInMinutes}px;`}></div>
					<div class="calendarEventName">{recurIcon}{props.item.tags[consts.EVENT_TAG_HOMEWORK] ? <HomeworkName name={displayName} /> : displayName}</div>
					{!cancelled && <div class="calendarEventTime">
						{startDisplay} to {endDisplay}
						{props.item.tags[consts.EVENT_TAG_ROOM_NUMBER] && ` in ${props.item.tags[consts.EVENT_TAG_ROOM_NUMBER]}`}
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