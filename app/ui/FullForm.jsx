import "ui/FullForm.styl";

import { h, Component } from "preact";

export default class FullForm extends Component {
	render(props, state) {
		return <div class="fullFormContainer">
			<div class={`fullForm ${props.class || ""}`}>
				{props.children}
			</div>
		</div>;
	}
}