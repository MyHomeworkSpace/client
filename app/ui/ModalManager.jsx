import "ui/ModalManager.styl";

import { h, Component } from "preact";

import api from "api.js";

import EventModal from "calendar/EventModal.jsx";
import ClassModal from "classes/ClassModal.jsx";
import ClassSwapModal from "classes/ClassSwapModal.jsx";
import BackgroundModal from "settings/BackgroundModal.jsx";
import TwoFactorModal from "settings/TwoFactorModal.jsx";

class ModalManager extends Component {
	closeModal() {
		this.props.openModal("", {});
	}

	render(props, state) {
		var modal;

		if (props.modalName == "calendarEvent") {
			modal = <EventModal modalState={props.modalState} openModal={props.openModal} />;
		} else if (props.modalName == "class") {
			modal = <ClassModal modalState={props.modalState} openModal={props.openModal} classes={props.classes} refreshClasses={props.refreshClasses} />;
		} else if (props.modalName == "classSwap") {
			modal = <ClassSwapModal modalState={props.modalState} openModal={props.openModal} classes={props.classes} refreshClasses={props.refreshClasses} />;
		} else if (props.modalName == "background") {
			modal = <BackgroundModal modalState={props.modalState} openModal={props.openModal} currentBackground={props.currentBackground} setBackground={props.setBackground} />;
		} else if (props.modalName == "twoFactor") {
			modal = <TwoFactorModal modalState={props.modalState} openModal={props.openModal} twoFactorEnabled={props.twoFactorEnabled} />;
		}

		return <div>
			{modal && <div class="modalOverlay" onClick={this.closeModal.bind(this)}></div>}
			{modal}
		</div>;
	}
}

export default ModalManager;