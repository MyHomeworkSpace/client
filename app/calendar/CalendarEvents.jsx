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

	componentWillReceiveProps(nextProps, nextState) {
		if (this.state.popover && nextProps.loadingEvents) {
			this.openPopover(null);
		}
	}

	openPopover(top, left, type, item, groupLength) {
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
				alternate: moment.unix(item.start).day() == 0 || moment.unix(item.start).day() == 6,
				groupLength: groupLength
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
		var daysOfWeek = 7;

		var events = [];
		var eventElements = [];
		var eventGroups = [];
		for (var i = 0; i < daysOfWeek; i++) {
			events.push([]);
			eventElements.push([]);
			eventGroups.push([]);
		}

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
			eventList.sort((a, b) => {
				return a.start - b.start;
			}).forEach(function(eventItem) {
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

		// now, try to merge events in the same group that don't overlap
		for (var i = 0; i < daysOfWeek; i++) {
			var groupsForDay = eventGroups[i];
			for (var j = 0; j < groupsForDay.length; j++) {
				var group = groupsForDay[j];

				var remainingEvents = group.slice(0);
				var skippedEvents = [];

				var subgroups = [];
				var currentSubgroup = [];

				// while we still have remaining events
				while (skippedEvents.length > 0 || remainingEvents.length > 0) {
					while (remainingEvents.length > 0) {
						if (currentSubgroup.length == 0) {
							// if our current subgroup is empty, fill it with the event
							currentSubgroup.push(remainingEvents.pop());
							if (remainingEvents.length == 0) {
								break;
							}
						}

						const nextEvent = remainingEvents.pop();

						// does this event have no overlaps with anyone in our subgroup?
						var hasOverlap = false;
						for (var k = 0; k < currentSubgroup.length; k++) {
							const comparisonEvent = currentSubgroup[k];
							if (
								(comparisonEvent.start < nextEvent.end) &&
								(nextEvent.start < comparisonEvent.end)
							) {
								hasOverlap = true;
								break;
							}
						}

						if (!hasOverlap) {
							// add it to our subgroup
							currentSubgroup.push(nextEvent);
						} else {
							// note that we need to come back to it
							skippedEvents.push(nextEvent);
						}
					}

					// done with our subgroup
					subgroups.push(currentSubgroup);
					currentSubgroup = [];
					remainingEvents = skippedEvents;
					skippedEvents = [];
				}

				// finally, update the group info
				eventGroups[i][j] = subgroups;
			}
		}

		eventGroups.forEach((eventGroupList, dow) => {
			eventGroupList.forEach((subgroupList) => {
				subgroupList.forEach((subgroup, subgroupIndex) => {
					subgroup.forEach((eventItem) => {
						eventElements[dow].push(<CalendarEvent type={eventItem.type} item={eventItem} groupIndex={subgroupIndex} groupLength={subgroupList.length} view={props.view} openPopover={this.openPopover.bind(this)} />);
					});
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
			{state.popover && <CalendarEventPopover alternate={state.popover.alternate} groupLength={state.popover.groupLength} item={state.popover.item} type={state.popover.type} top={state.popover.top} left={state.popover.left} view={props.view} openModal={props.openModal} openPopover={this.openPopover.bind(this)} />}
		</div>;
	}
};