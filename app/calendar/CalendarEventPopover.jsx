import "calendar/CalendarEventPopover.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import consts from "consts.js";

import HomeworkName from "ui/HomeworkName.jsx";

class CalendarEventPopover extends Component {
	edit() {
		var item = this.props.item;
		item.type = this.props.type;
		this.props.openModal("calendarEvent", item);
	}

	render(props, state) {
		var start = moment.unix(props.item.start);
		var end = moment.unix(props.item.end);

		var startDisplay = start.format("h:mm a");
		var endDisplay = end.format("h:mm a");

		var info;
		var actions;
		if (props.item.type == consts.EVENT_TYPE_SCHEDULE) {
			info = <div class="calendarEventPopoverInfo">
				{props.item.ownerName}
			</div>;
		} else if (props.item.type == consts.EVENT_TYPE_PLAIN || props.item.type == consts.EVENT_TYPE_HOMEWORK) {
			actions = <div class="calendarEventPopoverActions">
				<button class="btn btn-default btn-sm" onClick={this.edit.bind(this)}><i class="fa fa-pencil" /> Edit</button>
			</div>;
		}

		var left = props.left + 5;
		
		if (props.alternate) {
			left = left - (document.querySelector(".calendarEventsDay") || document.querySelector(".calendarMonthDayEvents")).clientWidth;
			left = left - 10;
		}

		return <div class={`calendarEventPopover ${props.alternate ? "calendarEventPopoverAlternate" : ""}`} style={`top: ${props.top}px; left: ${left}px`}>
			<div class="calendarEventPopoverName">{props.item.type == consts.EVENT_TYPE_HOMEWORK ? <HomeworkName name={props.item.data.homework.name} /> : props.item.name}</div>
			{info}
			<div class="calendarEventPopoverTime">{startDisplay} to {endDisplay}</div>
			{props.item.type == consts.EVENT_TYPE_SCHEDULE && (props.item.data.buildingName || props.item.data.roomNumber) && <div class="calendarEventPopoverLocation">{props.item.data.buildingName} Room {props.item.data.roomNumber}</div>}
			{props.item.type == consts.EVENT_TYPE_SCHEDULE && props.item.data.block && <div class="calendarEventPopoverPeriod">{props.item.data.block} Period</div>}
			{actions}
			{props.item.type == consts.EVENT_TYPE_SCHEDULE && <div class="calendarEventPopoverOrigin"><i class="fa fa-clock-o" /> from your schedule</div>}
		</div>;
	}
}

export default CalendarEventPopover;