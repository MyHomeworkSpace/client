import "ui/ModalManager.styl";

import { h, Component } from "preact";

import EventModal from "calendar/EventModal.jsx";
import ClassModal from "classes/ClassModal.jsx";
import ClassSwapModal from "classes/ClassSwapModal.jsx";
import HomeworkModal from "homework/HomeworkModal.jsx";
import BackgroundModal from "settings/panes/account/BackgroundModal.jsx";
import TwoFactorModal from "settings/panes/account/TwoFactorModal.jsx";
import LoadingModal from "ui/LoadingModal.jsx";

class ModalManager extends Component {
	closeModal() {
		this.props.openModal("", {});
	}

	render(props, state) {
		var modals = {
			calendarEvent: EventModal,
			class: ClassModal,
			classSwap: ClassSwapModal,
			homework: HomeworkModal,
			background: BackgroundModal,
			twoFactor: TwoFactorModal,
			loading: LoadingModal,
		};
		
		var modal;

		if (props.modalName) {
			modal = h(modals[props.modalName], {
				modalState: props.modalState,
				openModal: props.openModal,

				classes: props.classes,
				refreshClasses: props.refreshClasses,

				currentBackground: props.currentBackground,
				setBackground: props.setBackground,

				twoFactorEnabled: props.twoFactorEnabled
			});
		}

		return <div>
			{modal && <div class="modalOverlay" onClick={this.closeModal.bind(this)}></div>}
			{modal}
		</div>;
	}
}

export default ModalManager;