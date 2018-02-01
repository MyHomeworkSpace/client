import "homework/HomeworkPage.styl";

import { h, Component } from "preact";

import api from "api.js";

import HomeworkColumn from "homework/HomeworkColumn.jsx";

class HomeworkPage extends Component {
	constructor() {
		super();
		this.state = {
			loading: true,
		};
	}

	componentDidMount() {
		this.load();
	}

	componentWillReceiveProps(nextProps, nextState) {
		this.load();
	}

	load() {
		this.setState({
			loading: true
		}, function() {
			var that = this;
			api.get("homework/getHWViewSorted", {
				showToday: true
			}, function(xhr) {
				that.setState({
					loading: false,
					homework: xhr.responseJSON
				});
			});
		});
	}

	markOverdueDone() {
		var that = this;
		api.post("homework/markOverdueDone", {}, function(xhr) {
			that.load.call(that);
		});
	}

	render(props, state) {
		if (state.loading) {
			return <div class="homeworkPage">
				Loading, please wait...
			</div>;
		}

		var haveOverdue = (state.homework.overdue.length > 0);

		return <div class="homeworkPage">
			<div class="col-md-3 todayContainer">
				<HomeworkColumn title="Today" halfHeight noColumnClass items={state.homework.today} />
				{haveOverdue && <HomeworkColumn title="Overdue" halfHeight noColumnClass isOverdue onMarkAll={this.markOverdueDone.bind(this)} items={state.homework.overdue} />}
			</div>
			<HomeworkColumn title="Tomorrow" items={state.homework.tomorrow} />
			<HomeworkColumn title="Soon" items={state.homework.soon} />
			<HomeworkColumn title="Long-term" items={state.homework.longterm} />
		</div>;
	}
}

export default HomeworkPage;