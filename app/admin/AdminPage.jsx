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
		var that = this;
		this.setState({
			loading: true,
			users: null,
			feedback: null,
			notifications: null
		}, function() {
			api.get("admin/getUserCount", {}, function(data) {
				that.setState({
					userCount: data.count
				}, that.checkIfDoneLoading.bind(that));
			});
			api.get("admin/getAllFeedback", {}, function(data) {
				that.setState({
					feedback: data.feedbacks
				}, that.checkIfDoneLoading.bind(that));
			});
			api.get("notifications/get", {}, function(data) {
				that.setState({
					notifications: data.notifications
				}, that.checkIfDoneLoading.bind(that));
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
		var that = this;
		var content = prompt("Enter notification content");
		var expiry = prompt("Enter notification expiry");
		if (confirm("Look good? Content: " + content + " Expires: " + expiry)) {
			api.post("notifications/add", {expiry: expiry, content: content}, function() {
				that.load.call(that);
			});
		} else {
			alert("Aborted.");
		}
	}

	render(props, state) {
		var that = this;

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
					{state.feedback.map(function(feedback) {
						return <AdminListItem type="feedback" data={feedback} load={that.load.bind(that)}/>;
					})}
				</div>
				<div class="col-md-4">
					<h4 class="adminListTitle">Notifications</h4>
					{state.notifications.map(function(notification) {
						return <AdminListItem type="notification" data={notification} load={that.load.bind(that)}/>;
					})}
					<button class="btn btn-primary" onClick={that.newNotification.bind(that)}>New Notification</button>
				</div>
			</div>
		</div>;
	}
};