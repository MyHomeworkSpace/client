import "calendar/CalendarMonth.styl";

import { h, Component } from "preact";

import moment from "moment";

import { closestByClass } from "utils.js";

import CalendarEvent from "calendar/CalendarEvent.jsx";
import CalendarEventPopover from "calendar/CalendarEventPopover.jsx";

export default class CalendarMonth extends Component {
	constructor() {
		super();
		this.timer = null;
		this.state = {
			time: moment().unix(),
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
				alternate: moment.unix(item.start).day() == 5 || moment.unix(item.start).day() == 6,
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

	componentDidMount() {
		this.timer = setInterval(() => {
			this.setState({
				time: moment().unix()
			});
		}, 1000);
	}

	componentWillUnmount() {
		clearTimeout(this.timer);
		this.timer = null;
	}

	render(props, state) {
		let firstDay = moment(props.start).startOf("month");
		let lastDay = moment(props.start).endOf("month");

		let rows = [];
		let rowItems = [];

		let prefixDays = firstDay.day();
		let postfixDays = 6 - lastDay.day();
		let thisDay = moment(firstDay).subtract(prefixDays, "days");
		for (let i = firstDay.date() - prefixDays; i <= lastDay.date() + postfixDays; i++) {
			let isOtherMonth = (i < 1 || i > lastDay.date());
			let isToday = thisDay.isSame(moment.unix(state.time), "day");

			let viewDay;
			if (props.view) {
				viewDay = props.view.days[i - 1 + 7];
			}

			let day = <div class={`calendarMonthGridItem calendarMonthDay ${isToday ? "calendarMonthToday" : ""} ${isOtherMonth ? "calendarMonthDayOther" : ""} ${i < 8 ? "calendarMonthDayTopBorder" : ""}`}>
				<div class="calendarMonthDayNumber">{thisDay.date()}</div>
				<div class="calendarMonthDayEvents">
					{viewDay && viewDay.announcements.map(function(announcement) {
						return <div class="calendarMonthDayAnnouncement">{announcement.text}</div>;
					})}
					{viewDay && viewDay.events.sort((a, b) => {
						let aStart = moment.unix(a.start);
						let bStart = moment.unix(b.start);
						let aOffset = aStart.diff(moment(aStart).startOf("day"), "seconds");
						let bOffset = bStart.diff(moment(bStart).startOf("day"), "seconds");
						return aOffset - bOffset;
					}).map((event) => {
						return <CalendarEvent tiny type={event.type} item={event} groupIndex={0} groupLength={1} view={props.view} openPopover={this.openPopover.bind(this)} />;
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

			thisDay.add(1, "day");
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
			{state.popover && <CalendarEventPopover alternate={state.popover.alternate} groupLength={state.popover.groupLength} item={state.popover.item} type={state.popover.type} top={state.popover.top} left={state.popover.left} view={props.view} openModal={props.openModal} openPopover={this.openPopover.bind(this)} />}
		</div>;
	}
};