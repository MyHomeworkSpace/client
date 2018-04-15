import "calendar/CalendarWeek.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import CalendarEvents from "calendar/CalendarEvents.jsx";
import CalendarWeekDay from "calendar/CalendarWeekDay.jsx";

class CalendarWeek extends Component {
	constructor() {
		super();
		this.timer = null;
		this._resizeHandler = this.onResize.bind(this);
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

		var time = Math.floor((moment().unix() - moment("00:00:00", "HH:mm:ss").unix()) / 60);
		var scrollPos = time - 150;
		if (scrollPos < 0) {
			scrollPos = 0;
		}
		document.querySelector(".calendarWeekEventsContainer").scrollTop = scrollPos;

		// calculate offset for platforms with scrollbars
		// see https://github.com/MyHomeworkSpace/client/issues/69
		if (!this.state.foundOffset) {
			this.onResize();
		}

		window.addEventListener("resize", this._resizeHandler);
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this._resizeHandler);
		clearTimeout(this.timer);
		this.timer = null;
	}

	onResize() {
		this.setState({
			foundOffset: true,
			rightOffset: document.querySelector(".calendarWeekEventsContainer").offsetWidth - document.querySelector(".calendarWeekEventsContainer").clientWidth
		});
	}

	render(props, state) {
		var momentTime = moment.unix(state.time);

		return <div class="calendarWeek">
			<div class="calendarWeekHeader" style={`padding-right:${state.rightOffset || 0}px`}>
				<CalendarWeekDay announcements={props.announcements} time={momentTime} name="Monday" day={props.monday} />
				<CalendarWeekDay announcements={props.announcements} time={momentTime} name="Tuesday" day={moment(props.monday).add(1, "day")} />
				<CalendarWeekDay announcements={props.announcements} time={momentTime} name="Wednesday" day={moment(props.monday).add(2, "days")} />
				<CalendarWeekDay announcements={props.announcements} time={momentTime} name="Thursday" day={moment(props.monday).add(3, "days")} />
				<CalendarWeekDay announcements={props.announcements} time={momentTime} name={props.friday ? `Friday ${props.friday.index}` : "Friday"} day={moment(props.monday).add(4, "days")} />
				<CalendarWeekDay announcements={props.announcements} time={momentTime} name="Saturday" day={moment(props.monday).add(5, "days")} />
				<CalendarWeekDay announcements={props.announcements} time={momentTime} name="Sunday" day={moment(props.monday).add(6, "days")} />
			</div>

			<div class="calendarWeekEventsContainer">
				<CalendarEvents openModal={props.openModal} time={state.time} monday={props.monday} schedule={props.schedule} events={props.events} hwEvents={props.hwEvents} friday={props.friday} />
			</div>
		</div>;
	}
}

export default CalendarWeek;