import "calendar/CalendarEvents.styl";

import { h, Component } from "preact";

import CalendarEvent from "calendar/CalendarEvent.jsx";
import CalendarEventPopover from "calendar/CalendarEventPopover.jsx";
import CalendarEventsDay from "calendar/CalendarEventsDay.jsx";

class CalendarEvents extends Component {
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
		if ($(e.target).closest(".calendarEventPopover, .calendarEvent").length == 0) {
			this.openPopover(null);
		}
	}

	handleSettingClickHandler() {
		if (this.state.popover) {
			$("body").bind("click", this.state.bodyClick);
		} else {
			$("body").unbind("click", this.state.bodyClick);
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
							(eventItem.groupInfo.offset <= groupEventToTest.groupInfo.endOffsetHeight) &&
							(groupEventToTest.groupInfo.offset <= eventItem.groupInfo.endOffsetHeight)
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
					eventElements[dow].push(<CalendarEvent type={eventItem.type} item={eventItem} groupIndex={eventGroupIndex} groupLength={eventGroup.length} openPopover={that.openPopover.bind(that)} />);
				});
			});
		});

		var today = moment.unix(props.time);

		return <div class="calendarEvents">
			<div class="calendarEventsGutter">
				<div class="calendarEventsGutterHour">12a</div>
				<div class="calendarEventsGutterHour">1a</div>
				<div class="calendarEventsGutterHour">2a</div>
				<div class="calendarEventsGutterHour">3a</div>
				<div class="calendarEventsGutterHour">4a</div>
				<div class="calendarEventsGutterHour">5a</div>
				<div class="calendarEventsGutterHour">6a</div>
				<div class="calendarEventsGutterHour">7a</div>
				<div class="calendarEventsGutterHour">8a</div>
				<div class="calendarEventsGutterHour">9a</div>
				<div class="calendarEventsGutterHour">10a</div>
				<div class="calendarEventsGutterHour">11a</div>
				<div class="calendarEventsGutterHour">12p</div>
				<div class="calendarEventsGutterHour">1p</div>
				<div class="calendarEventsGutterHour">2p</div>
				<div class="calendarEventsGutterHour">3p</div>
				<div class="calendarEventsGutterHour">4p</div>
				<div class="calendarEventsGutterHour">5p</div>
				<div class="calendarEventsGutterHour">6p</div>
				<div class="calendarEventsGutterHour">7p</div>
				<div class="calendarEventsGutterHour">8p</div>
				<div class="calendarEventsGutterHour">9p</div>
				<div class="calendarEventsGutterHour">10p</div>
				<div class="calendarEventsGutterHour">11p</div>
			</div>
			<CalendarEventsDay today={today} time={props.time} day={props.monday}>{eventElements[0]}</CalendarEventsDay>
			<CalendarEventsDay today={today} time={props.time} day={moment(props.monday).add(1, "day")}>{eventElements[1]}</CalendarEventsDay>
			<CalendarEventsDay today={today} time={props.time} day={moment(props.monday).add(2, "day")}>{eventElements[2]}</CalendarEventsDay>
			<CalendarEventsDay today={today} time={props.time} day={moment(props.monday).add(3, "day")}>{eventElements[3]}</CalendarEventsDay>
			<CalendarEventsDay today={today} time={props.time} day={moment(props.monday).add(4, "day")}>{eventElements[4]}</CalendarEventsDay>
			<CalendarEventsDay today={today} time={props.time} day={moment(props.monday).add(5, "day")}>{eventElements[5]}</CalendarEventsDay>
			<CalendarEventsDay today={today} time={props.time} day={moment(props.monday).add(6, "day")}>{eventElements[6]}</CalendarEventsDay>
			{state.popover && <CalendarEventPopover alternate={state.popover.alternate} item={state.popover.item} type={state.popover.type} top={state.popover.top} left={state.popover.left} openModal={props.openModal} />}
		</div>;
	}
}

export default CalendarEvents;