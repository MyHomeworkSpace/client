import { h, Component } from "preact";

import api from "api.js";
import errors from "errors.js";

import LoadingIndicator from "ui/LoadingIndicator.jsx";
import Feedback from "admin/panes/feedback/Feedback.jsx";
import SortButton from "admin/panes/feedback/SortButton.jsx";

export default class FeedbackPane extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			feedback: null,
			sortType: 0
		};
	}

	componentDidMount() {
		this.load();
	}

	load() {
		this.setState({
			loading: true,
			feedback: null,
		}, () => {
			api.get("admin/getAllFeedback", {}, (data) => {
				this.setState({
					feedback: data.feedbacks,
					loading: false
				});
			});
		});
	}

	alphaSort(termA, termB) {
		let a = termA.toUpperCase();
		let b = termB.toUpperCase();
		if (a > b) {
			return -1;
		}
		if (b > a) {
			return 1;
		}
		return 0;
	}

	setSortType(sortType) {
		this.setState({
			sortType: sortType,
		});
	}

	render(props, state) {
		if (state.loading) {
			return <div class="feedbackPane">
				<LoadingIndicator />
			</div>;
		}

		let sortModes = [
			(a, b) => b.id - a.id, // id descending
			(a, b) => a.id - b.id, // id ascending
			(a, b) => this.alphaSort(a.userName.split(" ").pop(), b.userName.split(" ").pop()), // last name ascending
			(a, b) => this.alphaSort(b.userName.split(" ").pop(), a.userName.split(" ").pop()), // last name descending
			(a, b) => this.alphaSort(a.userEmail, b.userEmail), // email ascending
			(a, b) => this.alphaSort(b.userEmail, a.userEmail), // email descending
		];

		let sorted = state.feedback.sort(sortModes[state.sortType]);

		return <div class="feedbacksPane">
			<div className="alert alert-info">Remember to claim feedbacks on Slack in #incoming-feedback before replying to them!</div>
			<div class="btn-toolbar" role="toolbar">
				<div class="btn-group" role="group">
					<SortButton currentSortType={state.sortType} setSortType={this.setSortType.bind(this)} sortType={0} name="ID descending" icon="fa-sort-numeric-desc" />
					<SortButton currentSortType={state.sortType} setSortType={this.setSortType.bind(this)} sortType={1} name="ID ascending" icon="fa-sort-numeric-asc" />
				</div>
				<div class="btn-group" role="group">
					<SortButton currentSortType={state.sortType} setSortType={this.setSortType.bind(this)} sortType={2} name="Last name ascending" icon="fa-sort-alpha-asc" />
					<SortButton currentSortType={state.sortType} setSortType={this.setSortType.bind(this)} sortType={3} name="Last name descending" icon="fa-sort-alpha-desc" />
				</div>
				<div class="btn-group" role="group">
					<SortButton currentSortType={state.sortType} setSortType={this.setSortType.bind(this)} sortType={4} name="Email ascending" icon="fa-sort-alpha-asc" />
					<SortButton currentSortType={state.sortType} setSortType={this.setSortType.bind(this)} sortType={5} name="Email descending" icon="fa-sort-alpha-desc" />				</div>

			</div>
			<table className="table">
				{sorted.map((feedback, i) => <Feedback feedback={feedback} key={i} />)}
			</table>
		</div >;
	}
};