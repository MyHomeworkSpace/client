import { h, Component } from "preact";

import api from "api.js";

export default class ApplicationListItem extends Component {
	revoke() {
		var that = this;
		api.post("application/revokeAuth", {
			id: this.props.authorization.id
		}, function() {
			that.props.refresh();
		});
	}

	render(props, state) {
		return <div class="application">
			<div class="applicationInfo">
				<div class="applicationName">{props.authorization.name}</div>
				<div class="applicationAuthor">{props.authorization.authorName}</div>
			</div>
			<div class="applicationControls">
				<button class="btn btn-danger" onClick={this.revoke.bind(this)}>Revoke access</button>
			</div>
			<div class="applicationClear"></div>
		</div>;
	}
};