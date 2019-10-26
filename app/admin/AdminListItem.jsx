import "admin/AdminListItem.styl";

import { h, Component } from "preact";

import api from "api.js";

class AdminListItem extends Component {
	deleteNotification(id) {
		var that = this;
		if (confirm("Are you sure you want to delete this notification?")) {
			api.post("notifications/delete", {
				id: id
			}, function() {
				alert("Deleted!");
				that.props.load.call(that);
			});
		}
	}

	render(props, state) {
		if (props.type == "user") {
			return <div class="adminListItem">
				<p class="adminListName">{props.data.name}</p>
				<div>
					<span>{props.data.id} | {props.data.email} | {props.data.type} | Level {props.data.level} </span>
					<span>| Show migrate message? {props.data.showMigrateMessage == 1 ? "yes" : "no"}</span>
				</div>
			</div>;
		} else if (props.type == "feedback") {
			return <div class="adminListItem">
				<p class="adminListName">{props.data.text}</p>
				<div>
					<span>{props.data.id} | {props.data.userName} ({props.data.userEmail}) | {props.data.type} | {props.data.timestamp} {(props.data.hasScreenshot ? <span> | <a href={api.buildURL(`admin/getFeedbackScreenshot/${props.data.id}`, "GET", {})} target="_blank" rel="noopener noreferrer">Open Screenshot</a></span> : null)}</span>
				</div>
			</div>;
		} else if (props.type == "notification") {
			return <div class="adminListItem">
				<p class="adminListName">{props.data.content}</p>
				<div>
					<span>{props.data.id} | Expires {props.data.expiry} | <button class="btn btn-xs btn-danger" onClick={this.deleteNotification.bind(this, props.data.id)}>Delete</button></span>
				</div>
			</div>;
		}
		return <div class="adminListItem">
			<p class="adminListName">{JSON.stringify(props.data)}</p>
		</div>;
	}
}

export default AdminListItem;