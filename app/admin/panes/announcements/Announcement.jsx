import "admin/panes/announcements/Announcement.styl";

import { h, Component } from "preact";

import api from "api.js";

export default class Announcement extends Component {
	constructor(props) {
		super(props);
	}

	delete(id) {
		if (confirm(`Are you sure you want to delete announcement ${id}?`)) {
			api.post("notifications/delete", {
				id: id
			}, () => {
				this.props.load();
			});
		}
	}

	render(props, state) {
		return <tr class="announcement-item">
			<td>
				<h4>[<code>{String(props.announcement.id).padStart(4, "0")}</code>] {props.announcement.content}</h4>
				<p class="attribute"><strong>Expiry</strong>: {props.announcement.expiry}</p>
				<p class="attribute"><strong>Actions</strong>: <a onClick={this.delete.bind(this, props.announcement.id)} role="button" class="text-danger">Delete</a></p>
			</td>
		</tr >;
	}
};