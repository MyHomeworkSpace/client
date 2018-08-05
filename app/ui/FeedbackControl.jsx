import "ui/FeedbackControl.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import FeedbackPopup from "ui/FeedbackPopup.jsx";
import TopBarButton from "ui/nav/TopBarButton.jsx";

class FeedbackControl extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			bodyClick: this.onBodyClick.bind(this)
		};
	}

	onBodyClick(e) {
		var $target = $(e.target);
		if (!$target.hasClass("feedbackPopupFeelingOption") && $target.closest(".feedbackControlContainer").length == 0) {
			this.toggle();
		}
	}

	toggle() {
		this.setState({
			open: !this.state.open
		}, function() {
			if (this.state.open) {
				$("body").bind("click", this.state.bodyClick);
			} else {
				$("body").unbind("click", this.state.bodyClick);
			}
		});
	}

	render(props, state) {
		return <span class="feedbackControlContainer">
			<TopBarButton icon="comments-o" selected={state.open} onClick={this.toggle.bind(this)}>
				Feedback
			</TopBarButton>
			{state.open && <FeedbackPopup />}
		</span>;
	}
}

export default FeedbackControl;