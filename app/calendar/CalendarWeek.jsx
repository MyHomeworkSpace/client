import "calendar/CalendarWeek.styl";

import { h, Component } from "preact";

import moment from "moment";

import CalendarEvents from "calendar/CalendarEvents.jsx";
import CalendarWeekDay from "calendar/CalendarWeekDay.jsx";

export default class CalendarWeek extends Component {
	constructor() {
		super();
		this.timer = null;
		this._resizeHandler = this.onResize.bind(this);
		this.state = {
			time: moment().unix()
		};
	}

	componentDidMount() {
		this.timer = setInterval(() => {
			this.setState({
				time: moment().unix()
			});
		}, 1000);

		this._eventsContainer = document.querySelector(".calendarWeekEventsContainer");

		var time = Math.floor((moment().unix() - moment("00:00:00", "HH:mm:ss").unix()) / 60);
		var scrollPos = time - 150;
		if (scrollPos < 0) {
			scrollPos = 0;
		}

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
			rightOffset: this._eventsContainer.offsetWidth - this._eventsContainer.clientWidth
		});
	}

	render(props, state) {
		var momentTime = moment.unix(state.time);

		return <div class="calendarWeek">
			<div class="calendarDateHeader" style={`padding-right:${state.rightOffset || 0}px`}>
				<CalendarWeekDay announcements={props.view ? props.view.days[0].announcements : []} time={momentTime} name="Monday" day={props.start} />
				<CalendarWeekDay announcements={props.view ? props.view.days[1].announcements : []} time={momentTime} name="Tuesday" day={moment(props.start).add(1, "day")} />
				<CalendarWeekDay announcements={props.view ? props.view.days[2].announcements : []} time={momentTime} name="Wednesday" day={moment(props.start).add(2, "days")} />
				<CalendarWeekDay announcements={props.view ? props.view.days[3].announcements : []} time={momentTime} name="Thursday" day={moment(props.start).add(3, "days")} />
				<CalendarWeekDay announcements={props.view ? props.view.days[4].announcements : []} time={momentTime} name="Friday" day={moment(props.start).add(4, "days")} />
				<CalendarWeekDay announcements={props.view ? props.view.days[5].announcements : []} time={momentTime} name="Saturday" day={moment(props.start).add(5, "days")} />
				<CalendarWeekDay announcements={props.view ? props.view.days[6].announcements : []} time={momentTime} name="Sunday" day={moment(props.start).add(6, "days")} />
			</div>

			<div class="calendarWeekEventsContainer">
				<CalendarEvents loadingEvents={props.loadingEvents} openModal={props.openModal} time={state.time} start={props.start} view={props.view} />
			</div>
		</div>;
	}
};