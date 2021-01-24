import "admin/panes/feedback/Feedback.styl";

import { h, Component } from "preact";

import api from "api.js";

export default class Feedback extends Component {
	constructor(props) {
		super(props);
	}

	typeToIcon(type) {
		switch (type) {
			case "smile":
				return "fa-smile-o";
			case "frown":
				return "fa-frown-o";
			case "idea":
				return "fa-lightbulb-o";
			default:
				return "fa-question-circle";
		}
	}

	render(props, state) {
		return <tr class="feedback-item">
			<td>
				<h4>[<code>{String(props.feedback.id).padStart(4, "0")}</code>] <i class={`fa fa-fw ${this.typeToIcon(props.feedback.type)}`}></i> {props.feedback.text}</h4>
				<p class="attribute"><strong>Type</strong>: {props.feedback.type}</p>
				<p class="attribute"><strong>Timestamp</strong>: {new Date(props.feedback.timestamp).toLocaleString()}</p>
				<p class="attribute"><strong>User</strong>: {props.feedback.userName} &lt;{props.feedback.userEmail}&gt;</p>
				<p class="attribute"><strong>Screenshot</strong>: {props.feedback.hasScreenshot ? <a href={api.buildURL(`admin/getFeedbackScreenshot/${props.feedback.id}`, "GET", {})} rel="noreferrer noopener" target="_blank">Open screenshot</a> : "No screenshot."}</p>
			</td>
		</tr >;
	}
};