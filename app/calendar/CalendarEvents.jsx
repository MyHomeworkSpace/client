import "calendar/CalendarEvents.styl";

import { h, Component } from "preact";

import moment from "moment";

import { closestByClass } from "utils.js";

import CalendarEvent from "calendar/CalendarEvent.jsx";
import CalendarEventPopover from "calendar/CalendarEventPopover.jsx";
import CalendarEventsDay from "calendar/CalendarEventsDay.jsx";

export default class CalendarEvents extends Component {
	constructor(props) {
		super(props);
		this.state = {
			bodyClick: this.onBodyClick.bind(this)
		};
	}

	openPopover(top, left, type, item) {
		if (
			top == null ||
			(this.state.popover && this.state.popover.top == (top - 10) && this.state.popover.left == left)
		) {
			this.setState({
				popover: null
			}, function() {
				this.handleSettingClickHandler();
			});
			return;
		}
		this.setState({
			popover: {
				top: top - 10,
				left: left,
				type: type,
				item: item,
				alternate: moment.unix(item.start).day() == 0 || moment.unix(item.start).day() == 6
			}
		}, function() {
			this.handleSettingClickHandler();
		});
	}

	onBodyClick(e) {
		if (!closestByClass(e.target, "calendarEventPopover") && !closestByClass(e.target, "calendarEvent")) {
			this.openPopover(null);
		}
	}

	handleSettingClickHandler() {
		if (this.state.popover) {
			document.body.addEventListener("click", this.state.bodyClick);
		} else {
			document.body.removeEventListener("click", this.state.bodyClick);
		}
	}

	render(props, state) {
		var that = this;

		var events = [
			[], [], [], [], [], [], []
		];
		var eventElements = [
			[], [], [], [], [], [], []
		];

		var eventGroups = [
			[], [], [], [], [], [], []
		];
		if (props.view) {
			props.view.days.forEach(function(day, dow) {
				events[dow] = day.events.map(function(eventItem) {
					eventItem.groupInfo = {
						dayStart: moment.unix(eventItem.start).startOf("day"),
						start: moment.unix(eventItem.start),
						end: moment.unix(eventItem.end),
					};
					eventItem.groupInfo.offset = eventItem.groupInfo.start.diff(eventItem.groupInfo.dayStart, "minutes");
					eventItem.groupInfo.durationInMinutes = eventItem.groupInfo.end.diff(eventItem.groupInfo.start, "minutes");
					eventItem.groupInfo.height = (eventItem.groupInfo.durationInMinutes < 10 ? 10: eventItem.groupInfo.durationInMinutes);
					eventItem.groupInfo.endOffset = eventItem.groupInfo.offset + eventItem.groupInfo.durationInMinutes;
					eventItem.groupInfo.endOffsetHeight = eventItem.groupInfo.offset + eventItem.groupInfo.height;
					return eventItem;
				});
			});
		}
		events.forEach(function(eventList, dow) {
			var groupsForDay = eventGroups[dow];
			eventList.forEach(function(eventItem) {
				// find which group this event belongs to
				var foundGroupIndex = -1;
				for (var groupIndex in groupsForDay) {
					var groupToTest = groupsForDay[groupIndex];
					for (var eventIndex in groupToTest) {
						var groupEventToTest = groupToTest[eventIndex];

						if (
							(eventItem.groupInfo.offset < groupEventToTest.groupInfo.endOffsetHeight) &&
							(groupEventToTest.groupInfo.offset < eventItem.groupInfo.endOffsetHeight)
						) {
							foundGroupIndex = groupIndex;
							break;
						}
					}
				}

				if (foundGroupIndex != -1) {
					groupsForDay[foundGroupIndex].push(eventItem);
				} else {
					groupsForDay.push([ eventItem ]);
				}
			});
		});

		eventGroups.forEach(function(eventGroupList, dow) {
			eventGroupList.forEach(function(eventGroup) {
				eventGroup.forEach(function(eventItem, eventGroupIndex) {
					eventElements[dow].push(<CalendarEvent type={eventItem.type} item={eventItem} groupIndex={eventGroupIndex} groupLength={eventGroup.length} view={props.view} openPopover={that.openPopover.bind(that)} />);
				});
			});
		});

		var today = moment.unix(props.time);

		return <div class="calendarEvents">
			<div class="calendarEventsGutter">
				<div class="calendarEventsGutterHour">12 am</div>
				<div class="calendarEventsGutterHour">1 am</div>
				<div class="calendarEventsGutterHour">2 am</div>
				<div class="calendarEventsGutterHour">3 am</div>
				<div class="calendarEventsGutterHour">4 am</div>
				<div class="calendarEventsGutterHour">5 am</div>
				<div class="calendarEventsGutterHour">6 am</div>
				<div class="calendarEventsGutterHour">7 am</div>
				<div class="calendarEventsGutterHour">8 am</div>
				<div class="calendarEventsGutterHour">9 am</div>
				<div class="calendarEventsGutterHour">10 am</div>
				<div class="calendarEventsGutterHour">11 am</div>
				<div class="calendarEventsGutterHour">12 pm</div>
				<div class="calendarEventsGutterHour">1 pm</div>
				<div class="calendarEventsGutterHour">2 pm</div>
				<div class="calendarEventsGutterHour">3 pm</div>
				<div class="calendarEventsGutterHour">4 pm</div>
				<div class="calendarEventsGutterHour">5 pm</div>
				<div class="calendarEventsGutterHour">6 pm</div>
				<div class="calendarEventsGutterHour">7 pm</div>
				<div class="calendarEventsGutterHour">8 pm</div>
				<div class="calendarEventsGutterHour">9 pm</div>
				<div class="calendarEventsGutterHour">10 pm</div>
				<div class="calendarEventsGutterHour last">11 pm</div>
			</div>
			<div class="calendarEventsHourBackgrounds">
				{Array.apply(null, Array(24)).map(function(_, i) {
					return <div class={`calendarEventsHourBackground ${i == 23 ? "last" : ""}`}></div>;
				})}
			</div>
			<CalendarEventsDay today={today} time={props.time} day={props.monday}>{eventElements[0]}</CalendarEventsDay>
			<CalendarEventsDay today={today} time={props.time} day={moment(props.monday).add(1, "day")}>{eventElements[1]}</CalendarEventsDay>
			<CalendarEventsDay today={today} time={props.time} day={moment(props.monday).add(2, "day")}>{eventElements[2]}</CalendarEventsDay>
			<CalendarEventsDay today={today} time={props.time} day={moment(props.monday).add(3, "day")}>{eventElements[3]}</CalendarEventsDay>
			<CalendarEventsDay today={today} time={props.time} day={moment(props.monday).add(4, "day")}>{eventElements[4]}</CalendarEventsDay>
			<CalendarEventsDay today={today} time={props.time} day={moment(props.monday).add(5, "day")}>{eventElements[5]}</CalendarEventsDay>
			<CalendarEventsDay today={today} time={props.time} day={moment(props.monday).add(6, "day")}>{eventElements[6]}</CalendarEventsDay>
			{state.popover && <CalendarEventPopover alternate={state.popover.alternate} item={state.popover.item} type={state.popover.type} top={state.popover.top} left={state.popover.left} view={props.view} openModal={props.openModal} />}
		</div>;
	}
};