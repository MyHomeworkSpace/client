import "calendar/CalendarEvents.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import CalendarEvent from "calendar/CalendarEvent.jsx";
import CalendarNowLine from "calendar/CalendarNowLine.jsx";

class CalendarEvents extends Component {
	render(props, state) {
		var that = this;

		var events = {};

		[1, 2, 3, 4, 5].map(function(dayNumber) {
			var scheduleEvents = props.schedule[dayNumber].map(function(item) {
				return <CalendarEvent type="schedule" item={item} />
			});
			var hwEvents = [];
			events[dayNumber] = scheduleEvents.concat(hwEvents);
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
			<div class="calendarEventsDay">{events[5]}</div>
			<div class="calendarEventsDay"></div>
			<div class="calendarEventsDay"></div>
		</div>;
	}
}

export default CalendarEvents;