import { h } from "preact";

export default function OnboardingFooter(props) {
	switch (props.step) {
		case 0:
			return <div class="modal-footer">
				<button type="button" class="btn btn-default" onClick={props.closeModal}>Skip</button>
				<button type="button" class="btn btn-primary" onClick={() => props.setStep(props.step + 1)}>Start tour</button>
			</div>;
		case (props.totalSteps - 1):
			return <div class="modal-footer">
				<button type="button" class="btn btn-primary" onClick={props.closeModal}>Get started!</button>
			</div>;
		default:
			return <div class="modal-footer">
				<button type="button" class="btn btn-default" onClick={() => props.setStep(props.step - 1)}>Back</button>
				<button type="button" class="btn btn-primary" onClick={() => props.setStep(props.step + 1)}>Next</button>
			</div>;

	}
}