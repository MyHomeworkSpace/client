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
			api.get("homework/getHWViewSorted", {}, function(xhr) {
				that.setState({
					loading: false,
					homework: xhr.responseJSON
				});
			});
		});
	}

	markOverdueDone() {
		api.post("homework/markOverdueDone", {}, function(xhr) {
			this.load();
		});
	}

	render(props, state) {
		if (state.loading) {
			return <div class="homeworkPage">
				Loading, please wait...
			</div>;
		}

		return <div class="homeworkPage">
			{state.homework.overdue.length > 0 && <HomeworkColumn title="Overdue" isOverdue onMarkAll={this.markOverdueDone.bind(this)} items={state.homework.overdue} />}
			<HomeworkColumn title="Tomorrow" items={state.homework.tomorrow} />
			<HomeworkColumn title="Soon" items={state.homework.soon} />
			<HomeworkColumn title="Long-term" items={state.homework.longterm} />
		</div>;
	}
}

export default HomeworkPage;