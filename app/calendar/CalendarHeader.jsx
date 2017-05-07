import "calendar/CalendarHeader.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

class CalendarHeader extends Component {
	render(props, state) {
		return <div class="calendarHeader">
			Week of {props.monday.format("MMMM D, YYYY")}
		</div>;
	}
}

export default CalendarHeader;