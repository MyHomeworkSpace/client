import "homework/HomeworkPage.styl";

import { h, Component } from "preact";

import api from "api.js";

import HomeworkColumn from "homework/HomeworkColumn.jsx";
import CalendarRow from "homework/CalendarRow.jsx";

import { MyHomeworkSpaceCtx } from "App.jsx";
import { useContext } from "preact/hooks";
import Page from "ui/Page.jsx";

export default class HomeworkPage extends Component {
	constructor() {
		super();
		this.state = {
			loading: true,
		};
	}

	componentDidMount() {
		this.load();
	}

	componentWillReceiveProps() {
		this.load();
	}

	load() {
		this.setState({
			loading: true
		}, () => {
			api.get("homework/getHWViewSorted", {
				showToday: true
			}, (data) => {
				this.setState({
					loading: false,
					homework: data
				});
			});
		});
	}

	markOverdueDone() {
		api.post("homework/markOverdueDone", {}, () => {
			this.load();
		});
	}

	render(props, state) {
		if (state.loading) {
			return <div class="homeworkPage">
				<div class="container-fluid">
					Loading, please wait...
				</div>
			</div>;
		}

		var haveOverdue = (state.homework.overdue.length > 0);

		return <Page>
			<MyHomeworkSpaceCtx.Consumer>
				{MyHomeworkSpace => <div class="homeworkPage">
					{!MyHomeworkSpace.prefs.hideCalendarFromDashboard && <CalendarRow />}
					{(state.homework.showToday || haveOverdue) && <div class="col-md-3 todayContainer">
						{state.homework.showToday && <HomeworkColumn title="Today" halfHeight hideDue top={haveOverdue} noColumnClass items={state.homework.today} />}
						{haveOverdue && <HomeworkColumn title="Overdue" halfHeight noColumnClass isOverdue onMarkAll={this.markOverdueDone.bind(this)} items={state.homework.overdue} />}
					</div>}
					<HomeworkColumn title={state.homework.tomorrowName} hideDue items={state.homework.tomorrow} />
					<HomeworkColumn title="Soon" items={state.homework.soon} />
					<HomeworkColumn title="Long-term" items={state.homework.longterm} />
				</div>}
			</MyHomeworkSpaceCtx.Consumer>
		</Page>;
	}
};