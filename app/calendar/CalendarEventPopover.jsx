import "calendar/CalendarEventPopover.styl";

import { h, Component } from "preact";

import moment from "moment";

import consts from "consts.js";

import ClassName from "ui/ClassName.jsx";
import HomeworkName from "ui/HomeworkName.jsx";

export default class CalendarEventPopover extends Component {
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
		if (props.item.tags[consts.EVENT_TAG_OWNER_NAME]) {
			info = <div class="calendarEventPopoverInfo">
				{props.item.ownerName}
			</div>;
		} else if (!props.item.tags[consts.EVENT_TAG_READ_ONLY] && props.item.id != -1) {
			if (props.item.tags[consts.EVENT_TAG_HOMEWORK]) {
				var homeworkItem = props.item.tags[consts.EVENT_TAG_HOMEWORK];

				var classObject;
				for (var classIndex in MyHomeworkSpace.Classes.list) {
					if (MyHomeworkSpace.Classes.list[classIndex].id == homeworkItem.classId) {
						classObject = MyHomeworkSpace.Classes.list[classIndex];
					}
				}

				info = <div class="calendarEventPopoverInfo">
					<ClassName classObject={classObject} />
				</div>;
			}

			actions = <div class="calendarEventPopoverActions">
				<button class="btn btn-default btn-sm" onClick={this.edit.bind(this)}><i class="fa fa-pencil" /> Edit</button>
			</div>;
		}

		if (props.item.tags[consts.EVENT_TAG_ACTIONS]) {
			var actionList = props.item.tags[consts.EVENT_TAG_ACTIONS];
			actions = <div class="calendarEventPopoverActions">
				{actionList.map((action) => {
					return <a href={action.url} class={`btn btn-default btn-sm`} target="_blank"><i class={`fa fa-${action.icon}`} /> {action.name}</a>;
				})}
			</div>;
		}

		var left = props.left + 5;
		
		if (props.alternate) {
			left = left - (document.querySelector(".calendarEventsDay") || document.querySelector(".calendarMonthDayEvents")).clientWidth;
			left = left - 10;
		}

		return <div class={`calendarEventPopover ${props.alternate ? "calendarEventPopoverAlternate" : ""}`} style={`top: ${props.top}px; left: ${left}px`}>
			<div class="calendarEventPopoverName">{props.item.tags[consts.EVENT_TAG_HOMEWORK] ? <HomeworkName name={props.item.tags[consts.EVENT_TAG_HOMEWORK].name} /> : props.item.name}</div>
			{info}
			<div class="calendarEventPopoverTime">{startDisplay} to {endDisplay}</div>
			{(props.item.tags[consts.EVENT_TAG_BUILDING_NAME] || props.item.tags[consts.EVENT_TAG_ROOM_NUMBER]) && <div class="calendarEventPopoverLocation">{props.item.tags[consts.EVENT_TAG_BUILDING_NAME]} {(props.item.tags[consts.EVENT_TAG_ROOM_NUMBER] != "Library" && props.item.tags[consts.EVENT_TAG_ROOM_NUMBER] != "Cafeteria" && props.item.tags[consts.EVENT_TAG_ROOM_NUMBER] != "Theater") ? "Room " : ""}{props.item.tags[consts.EVENT_TAG_ROOM_NUMBER]}</div>}
			{props.item.tags[consts.EVENT_TAG_LOCATION] && <div class="calendarEventPopoverLocation">{props.item.tags[consts.EVENT_TAG_LOCATION]}</div>}
			{props.item.tags[consts.EVENT_TAG_BLOCK] && <div class="calendarEventPopoverPeriod">{props.item.tags[consts.EVENT_TAG_BLOCK]} Period</div>}
			{actions}
			{props.item.source > -1 && <div class="calendarEventPopoverOrigin"><i class="fa fa-calendar" /> from {props.view.providers[props.item.source].name}</div>}
			{props.item.recurRule && <div class="calendarEventPopoverOrigin"><i class="fa fa-refresh" /> recurring event</div>}
		</div>;
	}
};