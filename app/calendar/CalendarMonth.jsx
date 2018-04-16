import "calendar/CalendarMonth.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

class CalendarMonth extends Component {
	constructor() {
		super();
		this.timer = null;
		this.state = {
			time: moment().unix()
		};
	}

	componentDidMount() {
		var that = this;
		this.timer = setInterval(function() {
			that.setState({
				time: moment().unix()
			});
		}, 1000);
	}

	componentWillUnmount() {
		clearTimeout(this.timer);
		this.timer = null;
	}

	render(props, state) {
		var firstDay = moment(props.start).startOf("month");
		var lastDay = moment(props.start).endOf("month");
		
		var rows = [];
		var rowItems = [];
		
		for (var i = 0; i < firstDay.day(); i++) {
			// add spacers for days from last month
			rowItems.push(<div class="calendarMonthGridItem calendarMonthGridSpacer"></div>);
		}
		for (var i = firstDay.date(); i <= lastDay.date(); i++) {
			var thisDay = moment(props.start).date(i);
			var isToday = thisDay.isSame(moment.unix(state.time), "day");
			var viewDay;
			if (props.view) {
				viewDay = props.view.days[i - 1 + 7];
			}
			var day = <div class={`calendarMonthGridItem calendarMonthDay ${isToday ? "calendarMonthToday" : ""} ${i == 1 ? "calendarMonthDayFirst" : ""} ${i < 8 ? "calendarMonthDayTopBorder" : ""}`}>
				<div class="calendarMonthDayNumber">{i}</div>
				<div class="calendarMonthDayEvents">
					{viewDay && viewDay.events.map(function(event) {
						return <div>{event.name}</div>;
					})}
				</div>
			</div>;
			rowItems.push(day);
			if (rowItems.length == 7) {
				rows.push(<div class="calendarMonthRow">
					{rowItems}
				</div>);
				rowItems = [];
			}
		}
		if (rowItems.length > 0) {
			while (rowItems.length < 7) {
				// add spacers for days from next month
				rowItems.push(<div class="calendarMonthGridItem calendarMonthGridSpacer"></div>);
			}
			rows.push(<div class="calendarMonthRow">
				{rowItems}
			</div>);
			rowItems = [];
		}
		return <div class="calendarMonth">
			<div class="calendarMonthGrid">
				<div class="calendarMonthRow calendarMonthHeader">
					<div class="calendarMonthGridItem">Sunday</div>
					<div class="calendarMonthGridItem">Monday</div>
					<div class="calendarMonthGridItem">Tuesday</div>
					<div class="calendarMonthGridItem">Wednesday</div>
					<div class="calendarMonthGridItem">Thursday</div>
					<div class="calendarMonthGridItem">Friday</div>
					<div class="calendarMonthGridItem">Saturday</div>
				</div>
				{rows}
			</div>
		</div>;
	}
}

export default CalendarMonth;