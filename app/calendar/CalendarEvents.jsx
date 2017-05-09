import "calendar/CalendarEvents.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import CalendarEvent from "calendar/CalendarEvent.jsx";
import CalendarEventPopover from "calendar/CalendarEventPopover.jsx";
import CalendarNowLine from "calendar/CalendarNowLine.jsx";

class CalendarEvents extends Component {
	openPopover(top, left, type, item) {
		if (this.state.popover && this.state.popover.top == (top - 10) && this.state.popover.left == left) {
			this.setState({
				popover: null
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
		});
	}

	render(props, state) {
		var that = this;

		var events = [
			[], [], [], [], [], [], [], [], [], []
		];

		[1, 2, 3, 4, 5, 6, 7, 8].map(function(dayNumber) {
			var scheduleEvents = props.schedule[dayNumber].map(function(item) {
				return <CalendarEvent type="schedule" item={item} openPopover={that.openPopover.bind(that)} />;
			});
			events[dayNumber] = scheduleEvents.concat(events[dayNumber]);
		});

		props.events.forEach(function(calendarEvent) {
			var start = moment.unix(calendarEvent.start);
			var end = moment.unix(calendarEvent.end);
			var dow = start.day();
			if (dow == 6) { dow = 9; }
			if (dow == 0) { dow = 10; }
			events[dow].push(<CalendarEvent type="event" item={calendarEvent} openPopover={that.openPopover.bind(that)} />);
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
			<div class="calendarEventsDay">{events[1]}</div>
			<div class="calendarEventsDay">{events[2]}</div>
			<div class="calendarEventsDay">{events[3]}</div>
			<div class="calendarEventsDay">{events[4]}</div>
			<div class="calendarEventsDay">{props.friday && events[5 + (props.friday.index - 1)]}</div>
			<div class="calendarEventsDay">{events[9]}</div>
			<div class="calendarEventsDay">{events[10]}</div>
			{state.popover && <CalendarEventPopover item={state.popover.item} type={state.popover.type} top={state.popover.top} left={state.popover.left} />}
		</div>;
	}
}

export default CalendarEvents;