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
			loading: true
		};
	}

	componentDidMount() {
		this.loadWeek(this.state.currentWeek || moment().weekday(1));
	}

	componentWillReceiveProps() {
		this.loadWeek(this.state.currentWeek || moment().weekday(1));
	}

	loadWeek(week) {
		var that = this;

		this.setState({
			loading: true,
			currentWeek: week,
			homeworkInfo: null,
			weekInfo: null
		}, function() {
			var that = this;
			api.get("planner/getWeekInfo/" + that.state.currentWeek.format("YYYY-MM-DD"), {}, function(weekData) {
				that.setState({
					weekInfo: weekData
				}, function() {
					api.get("homework/getWeek/" + that.state.currentWeek.format("YYYY-MM-DD"), {}, function(homeworkData) {
						that.setState({
							loading: false,
							homeworkInfo: homeworkData
						});
					});
				});
			});
		});
	}

	setDone(id, done) {
		var editedHomework;
		var editedHomeworkIndex;
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

		var newHomeworkInfo = this.state.homeworkInfo;
		newHomeworkInfo.homework[editedHomeworkIndex] = editedHomework;

		this.setState({
			homeworkInfo: newHomeworkInfo
		});
	}

	render(props, state) {
		var that = this;

		if (!state.currentWeek) {
			return <div class="plannerPage"></div>;
		}

		var classHomework = {};
		
		if (state.homeworkInfo) {
			state.homeworkInfo.homework.forEach(function(homeworkItem) {
				if (!classHomework[homeworkItem.classId]) {
					classHomework[homeworkItem.classId] = [];
				}
				classHomework[homeworkItem.classId].push(homeworkItem);
			});
		}

		return <div class="plannerPage">
			<DateHeader
				start={state.currentWeek}
				loadWeek={this.loadWeek.bind(this)}
				loadingEvents={state.loading}
				type="week"
			/>
			<div class="plannerHeader">
				{[ 0, 1, 2, 3, 4, 5, 6 ].map(function(day) {
					var currentDay = moment(state.currentWeek).add(day, "days");
					var formattedDay = currentDay.format("YYYY-MM-DD");
					var fridayIndex;
					if (currentDay.weekday() == 5) {
						if (state.weekInfo && state.weekInfo.friday && state.weekInfo.friday.index > -1) {
							fridayIndex = state.weekInfo.friday.index;
						}
					}
					return <div class="plannerHeaderColumn">
						<div class="plannerHeaderDay">
							<span class="plannerHeaderDayOfWeek">{currentDay.format("dddd")} {fridayIndex}</span>
							<span class="plannerHeaderDate">{currentDay.format("M/D")}</span>
						</div>
						<div class={`plannerHeaderAnnouncement ${day == 0 ? "plannerHeaderAnnouncementFirst": ""}`}>
							{(state.weekInfo ? state.weekInfo.announcements : []).filter(function(announcement) {
								return (announcement.date == formattedDay);
							}).map(function(announcement) {
								return <div class="plannerHeaderAnnouncementItem">{announcement.text}</div>;
							})}
						</div>
					</div>;
				})}
			</div>
			<div class="plannerWeek">
				{props.classes.map(function(classObject) {
					return <PlannerClassRow
						currentWeek={state.currentWeek}
						classObject={classObject}
						classHomework={classHomework || {}}
						setDone={that.setDone.bind(that)}
						openModal={props.openModal}
					/>;
				})}
			</div>
		</div>;
	}
};