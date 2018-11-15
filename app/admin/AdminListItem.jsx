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
					<span>{props.data.id} | {props.data.username} | {props.data.email} | {props.data.type} | Level {props.data.level} </span>
					<span>| Show migrate message? {props.data.showMigrateMessage == 1 ? "yes" : "no"}</span>
				</div>
			</div>;
		} else if (props.type == "feedback") {
			return <div class="adminListItem">
				<p class="adminListName">{props.data.text}</p>
				<div>
					<span>{props.data.id} | User {props.data.userid} | {props.data.type} | {props.data.timestamp}</span>
				</div>
			</div>;
		} else if (props.type == "notification") {
			return <div class="adminListItem">
				{/* Yes, you read that correctly. It does say "dangerouslySetInnerHTML", but it is safe to
						set HTML in that method IN THIS CASE ONLY, because the HTML received from the server is
						KNOWN TO BE SAFE, is it was set by admins, whom we know we can trust.*/}
				<p class="adminListName" dangerouslySetInnerHTML={{__html: props.data.content}}/>
				<div>
					<span>{props.data.id} | Expires {props.data.expiry} | <button class="btn btn-xs btn-danger" onClick={() => this.deleteNotification(props.data.id)}>Delete</button></span>
				</div>
			</div>;
		}
		return <div class="adminListItem">
			<p class="adminListName">{JSON.stringify(props.data)}</p>
		</div>;
	}
}

export default AdminListItem;