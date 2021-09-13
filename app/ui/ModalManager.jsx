import "ui/ModalManager.styl";

import { h, Component } from "preact";

import AccountMigrateModal from "auth/AccountMigrateModal.jsx";
import ChangeEmailModal from "auth/ChangeEmailModal.jsx";
import ChangePasswordModal from "auth/ChangePasswordModal.jsx";
import EventModal from "calendar/EventModal.jsx";
import EventProvidedModal from "calendar/EventProvidedModal.jsx";
import ClassModal from "classes/ClassModal.jsx";
import ClassSwapModal from "classes/ClassSwapModal.jsx";
import HomeworkModal from "homework/HomeworkModal.jsx";
import EnrollModal from "schools/EnrollModal.jsx";
import SchoolSettingsModal from "schools/SchoolSettingsModal.jsx";
import BackgroundModal from "settings/panes/account/BackgroundModal.jsx";
import TwoFactorModal from "settings/panes/account/TwoFactorModal.jsx";
import ChangeNameModal from "settings/panes/account/ChangeNameModal.jsx";
import MyApplicationDeleteModal from "settings/panes/applications/MyApplicationDeleteModal.jsx";
import MyApplicationSettingsModal from "settings/panes/applications/MyApplicationSettingsModal.jsx";
import LoadingModal from "ui/LoadingModal.jsx";
import ShortcutModal from "ui/ShortcutModal.jsx";
import ImageInfoModal from "ui/nav/ImageInfoModal.jsx";


export default class ModalManager extends Component {
	render(props, state) {
		var modals = {
			calendarEvent: EventModal,
			calendarEventProvided: EventProvidedModal,
			class: ClassModal,
			classSwap: ClassSwapModal,
			homework: HomeworkModal,
			enroll: EnrollModal,
			background: BackgroundModal,
			twoFactor: TwoFactorModal,
			loading: LoadingModal,
			changeEmail: ChangeEmailModal,
			changePassword: ChangePasswordModal,
			accountMigrate: AccountMigrateModal,
			schoolSettings: SchoolSettingsModal,
			shortcut: ShortcutModal,
			changeName: ChangeNameModal,
			imageInfo: ImageInfoModal,
			applicationDelete: MyApplicationDeleteModal,
			applicationSettings: MyApplicationSettingsModal,
		};

		var modal;

		if (props.modalName) {
			modal = h(modals[props.modalName], {
				modalState: props.modalState,
				openModal: props.openModal,

				me: MyHomeworkSpace.Me,

				refreshContext: props.refreshContext,

				classes: props.classes,

				currentBackground: props.currentBackground,
				setBackground: props.setBackground,

				twoFactorEnabled: props.twoFactorEnabled
			});
		}

		return <div>
			{modal}
		</div>;
	}
};