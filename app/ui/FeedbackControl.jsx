import "ui/FeedbackControl.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import FeedbackPopup from "ui/FeedbackPopup.jsx";

class FeedbackControl extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false
		};
	}

	toggle() {
		this.setState({
			open: !this.state.open
		});
	}

	render(props, state) {
		return <span class="feedbackControlContainer">
			<span class={`feedbackControl ${state.open ? "opened" : ""}`} onClick={this.toggle.bind(this)}>
				<i class="fa fa-comments-o" /> Feedback
			</span>
			{state.open && <FeedbackPopup />}
		</span>;
	}
}

export default FeedbackControl;