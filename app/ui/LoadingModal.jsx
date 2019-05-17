import { h, Component } from "preact";

import LoadingIndicator from "ui/LoadingIndicator.jsx";
import Modal from "ui/Modal.jsx";

export default class LoadingModal extends Component {
	render(props, state) {
		return <Modal noClose title="Loading..." openModal={props.openModal}>
			<div class="modal-body">
				<LoadingIndicator /> Loading, please wait...
			</div>
		</Modal>;
	}
};