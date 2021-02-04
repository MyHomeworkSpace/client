import { h, Component } from "preact";

import api from "api.js";

export default class MyApplicationListItem extends Component {
	render(props, state) {
		return <div class="application">
			<div class="applicationInfo">
				<div class="applicationName">{props.application.name}</div>
				<div class="applicationAuthor">{props.application.authorName}</div>
				<div><strong>Client ID:</strong> <code>{props.application.clientId}</code></div>
				<div><strong>Callback URI:</strong> {props.application.callbackUrl || <em>Unset</em>}</div>
			</div>
			<div class="applicationControls">
				<button class="btn btn-primary" onClick={() => props.openModal("applicationSettings", { application: props.application, refresh: props.refresh })}><i class="fa fa-fw fa-gear"></i> Settings</button>
				<button class="btn btn-danger" onClick={() => props.openModal("applicationDelete", { application: props.application, refresh: props.refresh })}><i class="fa fa-fw fa-trash"></i> Delete</button>
			</div>
			<div class="applicationClear"></div>
		</div>;
	}
};