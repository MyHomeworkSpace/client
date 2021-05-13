import { h } from "preact";

import "./OnboardingStep0.styl";

export default function OnboardingStep0(props) {
	return <div class="modal-body onboardingStep0">
		<div class="heart-beating-container text-danger">
			<i class="fa fa-heart heart-beating"></i>
		</div>
		<h4 class="text-center">On behalf of the entire MyHomeworkSpace team</h4>
		<h1 class="text-center welcome-text">Welcome!</h1>
		<h4 class="text-center">We're so glad you're here.</h4>
	</div>;
}