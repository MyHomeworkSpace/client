import "calendar/CalendarEvents.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import CalendarEvent from "calendar/CalendarEvent.jsx";
import CalendarEventPopover from "calendar/CalendarEventPopover.jsx";
import CalendarNowLine from "calendar/CalendarNowLine.jsx";

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
				item: item
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

	componentWillReceiveProps(nextProps) {
		this.setState({
			popover: null
		});
	}

	render(props, state) {
		var that = this;

		var events = [
			[], [], [], [], [], [], []
		];
		var eventElements = [
			[], [], [], [], [], [], []
		];

		[1, 2, 3, 4, 5].forEach(function(dayNumber) {
			(props.schedule[dayNumber - 1] || []).forEach(function(item) {
				item.type = "schedule";
				item.dow = dayNumber;
				events[dayNumber].push(item);
			});
		});

		props.events.map(function(e){
			var newEvent = e;
			newEvent.type = "event";
			return newEvent;
		}).concat(props.hwEvents.map(function(e){
			var newEvent = e;
			newEvent.type = "homework";
			return newEvent;
		})).forEach(function(calendarEvent) {
			var start = moment.unix(calendarEvent.start);
			var dow = start.day();
			calendarEvent.dow = dow;
			events[dow].push(calendarEvent);
		});

		var eventGroups = [
			[], [], [], [], [], [], []
		];
		events.forEach(function(eventList, dow) {
			events[dow] = events[dow].map(function(eventItem) {
				var isScheduleItem = (props.type == "schedule"); 
				eventItem.groupInfo = {
					dayStart: (isScheduleItem ? moment.unix(0).utc() : moment.unix(eventItem.start).startOf("day")),
					start: moment.unix(eventItem.start),
					end: moment.unix(eventItem.end),
				};
				if (isScheduleItem) {
					eventItem.groupInfo.start = eventItem.groupInfo.start.utc();
					eventItem.groupInfo.end = eventItem.groupInfo.end.utc();
				} else {
					eventItem.groupInfo.start.month(0);
					eventItem.groupInfo.start.day(0);
					eventItem.groupInfo.start.year(0);
					eventItem.groupInfo.end.month(0);
					eventItem.groupInfo.end.day(0);
					eventItem.groupInfo.end.year(0);
				}
				eventItem.groupInfo.offset = eventItem.groupInfo.start.diff(eventItem.groupInfo.dayStart, "minutes");
				eventItem.groupInfo.durationInMinutes = eventItem.groupInfo.end.diff(eventItem.groupInfo.start, "minutes");
				eventItem.groupInfo.height = (eventItem.groupInfo.durationInMinutes < 10 ? 10: eventItem.groupInfo.durationInMinutes);
				eventItem.groupInfo.endOffset = eventItem.groupInfo.offset + eventItem.groupInfo.durationInMinutes;
				eventItem.groupInfo.endOffsetHeight = eventItem.groupInfo.offset + eventItem.groupInfo.height;
				return eventItem;
			});
		});
		events.forEach(function(eventList, dow) {
			var groupsForDay = eventGroups[dow];
			eventList.forEach(function(eventItem, eventItemIndex) {
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
			<CalendarNowLine />
			<div class="calendarEventsDay">{eventElements[1]}</div>
			<div class="calendarEventsDay">{eventElements[2]}</div>
			<div class="calendarEventsDay">{eventElements[3]}</div>
			<div class="calendarEventsDay">{eventElements[4]}</div>
			<div class="calendarEventsDay">{eventElements[5]}</div>
			<div class="calendarEventsDay">{eventElements[6]}</div>
			<div class="calendarEventsDay">{eventElements[0]}</div>
			{state.popover && <CalendarEventPopover alternate={state.popover.item.dow == 0 || state.popover.item.dow == 6} item={state.popover.item} type={state.popover.type} top={state.popover.top} left={state.popover.left} openModal={props.openModal} />}
		</div>;
	}
}

export default CalendarEvents;