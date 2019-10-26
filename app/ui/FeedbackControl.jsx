import "ui/FeedbackControl.styl";

import { h, Component } from "preact";

import { closestByClass } from "utils.js";

import FeedbackPopup from "ui/FeedbackPopup.jsx";
import TopBarButton from "ui/nav/TopBarButton.jsx";

class FeedbackControl extends Component {
	constructor(props) {
		super(props);
		this._bodyClick = this.onBodyClick.bind(this);
		this.state = {
			open: false
		};
	}

	onBodyClick(e) {
		if (!e.target.classList.contains("feedbackPopupFeelingOption") && !closestByClass(e.target, "feedbackControlContainer")) {
			this.toggle();
		}
	}

	toggle() {
		this.setState({
			open: !this.state.open
		}, function() {
			if (this.state.open) {
				document.body.addEventListener("click", this._bodyClick);
			} else {
				document.body.removeEventListener("click", this._bodyClick);
			}
		});
	}

	render(props, state) {
		return <span class="feedbackControlContainer" data-html2canvas-ignore="true">
			<TopBarButton icon="comments-o" selected={state.open} onClick={this.toggle.bind(this)}>
				Feedback
			</TopBarButton>
			{state.open && <FeedbackPopup />}
		</span>;
	}
}

export default FeedbackControl;