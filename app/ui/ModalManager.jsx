import "ui/ModalManager.styl";

import { h, Component } from "preact";

import api from "api.js";

import ClassModal from "classes/ClassModal.jsx";

class ModalManager extends Component {
	closeModal() {
		this.props.openModal("", {});
	}

	render(props, state) {
		var modal;

		if (props.modalName == "class") {
			modal = <ClassModal modalState={props.modalState} openModal={props.openModal} refreshClasses={props.refreshClasses} />;
		}

		return <div>
			{modal && <div class="modalOverlay" onClick={this.closeModal.bind(this)}></div>}
			{modal}
		</div>;
	}
}

export default ModalManager;