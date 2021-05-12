import "planner/PlannerPage.styl";

import { h, Component } from "preact";

import moment from "moment";

import api from "api.js";

import PlannerClassRow from "planner/PlannerClassRow.jsx";

import DateHeader from "ui/DateHeader.jsx";

export default class PlannerPage extends Component {
	constructor() {
		super();
		this.state = {
			loading: true,
			time: moment().unix()
		};
	}

	componentDidMount() {
		this.timer = setInterval(() => {
			this.setState({
				time: moment().unix()
			});
		}, 1000);
		this.loadWeek(this.state.currentWeek || moment().weekday(1));
	}

	componentWillReceiveProps() {
		this.loadWeek(this.state.currentWeek || moment().weekday(1));
	}

	componentWillUnmount() {
		clearTimeout(this.timer);
		this.timer = null;
	}

	loadWeek(week) {
		this.setState({
			loading: true,
			currentWeek: week,
			homeworkInfo: null,
			weekInfo: null
		}, () => {
			api.get("planner/getWeekInfo/" + this.state.currentWeek.format("YYYY-MM-DD"), {}, (weekData) => {
				this.setState({
					weekInfo: weekData
				}, () => {
					api.get("homework/getWeek/" + this.state.currentWeek.format("YYYY-MM-DD"), {}, (homeworkData) => {
						this.setState({
							loading: false,
							homeworkInfo: homeworkData
						});
					});
				});
			});
		});
	}

	setDone(id, done) {
		let editedHomework;
		let editedHomeworkIndex;
		this.state.homeworkInfo.homework.forEach(function(homeworkItem, i) {
			if (homeworkItem.id == id) {
				editedHomework = homeworkItem;
				editedHomeworkIndex = i;
				return false;
			}
		});

		if (editedHomework) {
			editedHomework.complete = (done ? 1 : 0);
		}

		api.post("homework/edit", editedHomework, function(data) {});

		let newHomeworkInfo = this.state.homeworkInfo;
		newHomeworkInfo.homework[editedHomeworkIndex] = editedHomework;

		this.setState({
			homeworkInfo: newHomeworkInfo
		});
	}

	render(props, state) {
		if (!state.currentWeek) {
			return <div class="plannerPage"></div>;
		}

		let classHomework = {};
		
		if (state.homeworkInfo) {
			state.homeworkInfo.homework.forEach(function(homeworkItem) {
				if (!classHomework[homeworkItem.classId]) {
					classHomework[homeworkItem.classId] = [];
				}
				classHomework[homeworkItem.classId].push(homeworkItem);
			});
		}

		let now = moment.unix(state.time);

		return <div class="plannerPage">
			<DateHeader
				start={state.currentWeek}
				loadWeek={this.loadWeek.bind(this)}
				loadingEvents={state.loading}
				type="week"
			/>
			<div class="plannerHeader plannerHeaderFirst">
				{[ 0, 1, 2, 3, 4, 5, 6 ].map(function(day) {
					let currentDay = moment(state.currentWeek).add(day, "days");

					return <div class={`plannerHeaderColumn plannerHeaderDay ${currentDay.isBefore(now, "day") ? "plannerHeaderDayPast" : ""} ${currentDay.isSame(now, "day") ? "plannerHeaderDayToday" : ""}`}>
						<span class="plannerHeaderDayOfWeek">{currentDay.format("dddd")}</span>
						<span class="plannerHeaderDate">{currentDay.format("M/D")}</span>
					</div>;
				})}
			</div>
			<div class="plannerHeader">
				{[ 0, 1, 2, 3, 4, 5, 6 ].map(function(day) {
					let currentDay = moment(state.currentWeek).add(day, "days");
					let formattedDay = currentDay.format("YYYY-MM-DD");
					return <div class={`plannerHeaderColumn plannerHeaderAnnouncement ${day == 0 ? "plannerHeaderAnnouncementFirst": ""}`}>
						{(state.weekInfo ? state.weekInfo.announcements : []).filter(function(announcement) {
							return (announcement.date == formattedDay);
						}).map(function(announcement) {
							return <div class="plannerHeaderAnnouncementItem">{announcement.text}</div>;
						})}
					</div>;
				})}
			</div>
			<div class="plannerWeek">
				{props.classes.map((classObject) => {
					return <PlannerClassRow
						currentWeek={state.currentWeek}
						classObject={classObject}
						classHomework={classHomework || {}}
						setDone={this.setDone.bind(this)}
						openModal={props.openModal}
					/>;
				})}
			</div>
		</div>;
	}
};