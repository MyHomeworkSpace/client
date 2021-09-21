import { h, Component } from "preact";

export default class BarnardSettings extends Component {
	render(props, state) {
		return <div>
			<div class="modal-body">
				There are no settings for this school.
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-primary" onClick={props.closeModal}>Close</button>
			</div>
		</div>;
	}
};