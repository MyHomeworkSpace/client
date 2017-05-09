import "calendar/CalendarHeader.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import LoadingIndicator from "ui/LoadingIndicator.jsx";

class CalendarHeader extends Component {
	jumpWeek(weekAmount) {
		this.props.loadWeek(moment(this.props.monday).add(weekAmount, "week"));
	}

	jumpToday() {
		var mondayDate = moment();
		while (mondayDate.day() != 1) {
			mondayDate.subtract(1, "day");
		}
		this.props.loadWeek(mondayDate);
	}

	render(props, state) {
		return <div class="calendarHeader">
			<span class="calendarHeaderWeek">
				Week of {props.monday.format("MMMM D, YYYY")}
				{props.loadingWeek && <span><LoadingIndicator type="inline" /> Loading...</span>}
			</span>
			<div class="calendarHeaderControls">
				<button class="btn btn-default calendarHeaderControlsRefresh" onClick={this.jumpWeek.bind(this, 0)}><i class="fa fa-refresh"></i></button>
				<button class="btn btn-default" onClick={this.jumpWeek.bind(this, -1)}><i class="fa fa-chevron-left"></i></button>
				<button class="btn btn-default" onClick={this.jumpToday.bind(this)}>Today</button>
				<button class="btn btn-default" onClick={this.jumpWeek.bind(this, 1)}><i class="fa fa-chevron-right"></i></button>
			</div>
		</div>;
	}
}

export default CalendarHeader;