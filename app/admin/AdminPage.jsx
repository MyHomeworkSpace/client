import "admin/AdminPage.styl";

import { h, Component } from "preact";

import api from "api.js";

import AdminListItem from "admin/AdminListItem.jsx";

export default class AdminPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true
		};
	}

	componentDidMount() {
		this.load();
	}

	load() {
		this.setState({
			loading: true,
			users: null,
			feedback: null,
			notifications: null
		}, () => {
			api.get("admin/getUserCount", {}, (data) => {
				this.setState({
					userCount: data.count
				}, this.checkIfDoneLoading);
			});
			api.get("admin/getAllFeedback", {}, (data) => {
				this.setState({
					feedback: data.feedbacks
				}, this.checkIfDoneLoading);
			});
			api.get("notifications/get", {}, (data) => {
				this.setState({
					notifications: data.notifications
				}, this.checkIfDoneLoading);
			});
		});
	}

	checkIfDoneLoading() {
		if (this.state.feedback && this.state.userCount && this.state.notifications) {
			this.setState({
				loading: false
			});
		}
	}

	newNotification() {
		var content = prompt("Enter notification content");
		var expiry = prompt("Enter notification expiry");
		if (confirm("Look good? Content: " + content + " Expires: " + expiry)) {
			api.post("notifications/add", {expiry: expiry, content: content}, () => {
				this.load();
			});
		} else {
			alert("Aborted.");
		}
	}

	render(props, state) {
		if (state.loading) {
			return <p>Loading... please wait</p>;
		}

		return <div class="adminPage">
			<h2>Administration Tools</h2>
			<div class="row">
				<div class="col-md-4">
					<h4 class="adminListTitle">Users</h4>
					<p>There {state.userCount > 1 ? "are" : "is"} {state.userCount} user{state.userCount > 1 ? "s" : ""}.</p>
				</div>
				<div class="col-md-4">
					<h4 class="adminListTitle">Feedback</h4>
					{state.feedback.map((feedback) => {
						return <AdminListItem type="feedback" data={feedback} load={this.load.bind(this)}/>;
					})}
				</div>
				<div class="col-md-4">
					<h4 class="adminListTitle">Notifications</h4>
					{state.notifications.map((notification) => {
						return <AdminListItem type="notification" data={notification} load={this.load.bind(this)}/>;
					})}
					<button class="btn btn-primary" onClick={this.newNotification.bind(this)}>New Notification</button>
				</div>
			</div>
		</div>;
	}
};