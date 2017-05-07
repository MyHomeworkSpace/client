import "calendar/CalendarHeader.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

class CalendarHeader extends Component {
	jumpWeek(weekAmount) {
		this.props.loadWeek(moment(this.props.monday).add(weekAmount, "week"));
	}

	render(props, state) {
		return <div class="calendarHeader">
			Week of {props.monday.format("MMMM D, YYYY")}
			<button class="btn btn-default" onClick={this.jumpWeek.bind(this, -1)}>Back</button>
			<button class="btn btn-default" onClick={this.jumpWeek.bind(this, 1)}>Next</button>
		</div>;
	}
}

export default CalendarHeader;