import "calendar/CalendarEventPopover.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

class CalendarEventPopover extends Component {
	edit() {
		this.props.openModal("calendarEvent", this.props.item);
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
		} else if (props.type == "event") {
			actions = <div class="calendarEventPopoverActions">
				<button class="btn btn-default btn-sm" onClick={this.edit.bind(this)}><i class="fa fa-pencil" /> Edit</button>
			</div>;
		}


		return <div class="calendarEventPopover" style={`top: ${props.top}px; left: ${props.left + 5}px`}>
			<div class="calendarEventPopoverName">{props.item.name}</div>
			{info}
			<div class="calendarEventPopoverTime">{startDisplay} to {endDisplay}</div>
			{actions}
			{isScheduleItem && <div class="calendarEventPopoverOrigin"><i class="fa fa-clock-o" /> from your schedule</div>}
		</div>;
	}
}

export default CalendarEventPopover;