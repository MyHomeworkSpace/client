import { h, Component } from "preact";

import api from "api.js";

class ApplicationList extends Component {
	revoke() {
		var that = this;
		api.post("application/revokeAuth", {
			id: this.props.authorization.id
		}, function(data) {
			that.props.refresh();
		});
	}

	render(props, state) {
		return <div class="settingsApplication">
			<div class="settingsApplicationInfo">
				<div class="settingsApplicationName">{props.authorization.name}</div>
				<div class="settingsApplicationAuthor">{props.authorization.authorName}</div>
			</div>
			<div class="settingsApplicationControls">
				<button class="btn btn-danger" onClick={this.revoke.bind(this)}>Revoke access</button>
			</div>
			<div class="settingsApplicationClear"></div>
		</div>;
	}
}

export default ApplicationList;