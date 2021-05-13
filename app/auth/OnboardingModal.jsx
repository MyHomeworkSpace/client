import { h } from "preact";
import { useState } from "preact/hooks";

import Modal from "ui/Modal.jsx";

import "./OnboardingModal.styl";

import OnboardingStep0 from "auth/OnboardingSteps/OnboardingStep0.jsx";
import OnboardingStep1 from "auth/OnboardingSteps/OnboardingStep1.jsx";
import OnboardingStep2 from "auth/OnboardingSteps/OnboardingStep2.jsx";
import OnboardingStep3 from "auth/OnboardingSteps/OnboardingStep3.jsx";
import OnboardingFooter from "auth/OnboardingSteps/OnboardingFooter.jsx";

export default function OnboardingModal(props) {
	const steps = [
		{
			showOverlay: true,
			component: <OnboardingStep0 />,
			title: "Welcome to MyHomeworkSpace",
		},
		{
			showOverlay: true,
			component: <OnboardingStep1 />,
			title: "Homework"
		},
		{
			showOverlay: true,
			component: <OnboardingStep2 {...this.props} />,
			title: "Classes"
		},
		{
			showOverlay: true,
			component: <OnboardingStep3 {...this.props} />,
			title: "Calendar"
		},
		{
			showOverlay: true,
			component: <p>Yes overlay</p>,
			title: "hi"
		},
	];

	let [step, setStep] = useState(0);

	const setOnboardingStep = (step) => {
		props.showOverlay(steps[step].showOverlay);
		setStep(step);
	};

	return <Modal class="onboardingModal" title={steps[step].title} openModal={props.openModal} noClose={false}>
		{steps[step].component}
		<OnboardingFooter step={step} setStep={setOnboardingStep} closeModal={() => this.props.openModal("")} totalSteps={steps.length} />
	</Modal>;
}