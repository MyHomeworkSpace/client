import "calendar/CalendarEventPopover.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import HomeworkName from "ui/HomeworkName.jsx";

class CalendarEventPopover extends Component {
	edit() {
		var item = this.props.item;
		item.type = this.props.type;
		this.props.openModal("calendarEvent", item);
	}

	render(props, state) {
		var isScheduleItem = (props.type == "schedule");

		var start = moment.unix(props.item.start);
		var end = moment.unix(props.item.end);

		if (isScheduleItem) {
			start = start.utc();
			end = end.utc();
		}

		var startDisplay = start.format("h:mm a");
		var endDisplay = end.format("h:mm a");

		var info;
		var actions;
		if (props.type == "schedule") {
			info = <div class="calendarEventPopoverInfo">
				{props.item.ownerName}
			</div>;
		} else if (props.type == "event" || props.type == "homework") {
			actions = <div class="calendarEventPopoverActions">
				<button class="btn btn-default btn-sm" onClick={this.edit.bind(this)}><i class="fa fa-pencil" /> Edit</button>
			</div>;
		}

		var left = props.left + 5;
		
		if (props.alternate) {
			left = left - document.querySelector(".calendarEventsDay").clientWidth;
			left = left - 10;
		}

		return <div class={`calendarEventPopover ${props.alternate ? "calendarEventPopoverAlternate" : ""}`} style={`top: ${props.top}px; left: ${left}px`}>
			<div class="calendarEventPopoverName">{props.type == "homework" ? <HomeworkName name={props.item.homework.name} /> : props.item.name}</div>
			{info}
			<div class="calendarEventPopoverTime">{startDisplay} to {endDisplay}</div>
			{props.type == "schedule" && (props.item.buildingName || props.item.roomNumber) && <div class="calendarEventPopoverLocation">{props.item.buildingName} Room {props.item.roomNumber}</div>}
			{props.type == "schedule" && props.item.block && <div class="calendarEventPopoverPeriod">{props.item.block} Period</div>}
			{actions}
			{isScheduleItem && <div class="calendarEventPopoverOrigin"><i class="fa fa-clock-o" /> from your schedule</div>}
		</div>;
	}
}

export default CalendarEventPopover;