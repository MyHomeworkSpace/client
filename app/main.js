import { h, render } from "preact";

import api from "api.js";
import errors from "errors.js";
import prefixes from "prefixes.js";
import quickAdd from "quickAdd.js";

import CalendarPage from "calendar/CalendarPage.jsx";

import HelpPage from "help/HelpPage.jsx";

import HomeworkPage from "homework/HomeworkPage.jsx";

import ClassesPage from "classes/ClassesPage.jsx";

import AdminPage from "admin/AdminPage.jsx";

import ApplicationAuthForm from "auth/ApplicationAuthForm.jsx";
import CreateAccountForm from "auth/CreateAccountForm.jsx";
import CompleteEmailForm from "auth/CompleteEmailForm.jsx";
import LoginForm from "auth/LoginForm.jsx";
import ResetPasswordForm from "auth/ResetPasswordForm.jsx";

import PlannerPage from "planner/PlannerPage.jsx";

import SettingsPage from "settings/SettingsPage.jsx";

import AddAction from "ui/AddAction.jsx";
import ClassName from "ui/ClassName.jsx";
import DateHeader from "ui/DateHeader.jsx";
import FeedbackControl from "ui/FeedbackControl.jsx";
import HomeworkName from "ui/HomeworkName.jsx";
import ModalManager from "ui/ModalManager.jsx";

import TopBar from "ui/nav/TopBar.jsx";

var modalName = "";
var modalState = {};

var currentBackground = "";

var refreshClasses = function(callback) {
	MyHomeworkSpace.Classes.load(function() {
		MyHomeworkSpace.Classes.reload();
		MyHomeworkSpace.Page.show("classes");
		callback();
	});
};

var isDimBackground = function() {
	var bgType = currentBackground.split(":")[0];
	var bgVal = currentBackground.split(":")[1];
	if (bgType == "img") {
		var dimBackgrounds = [4, 5, 7, 8, 9, 10];
		if (dimBackgrounds.indexOf(parseInt(bgVal)) > -1) {
			return true;
		}
	}
	return false;
};

var setBackground = function(newBackground) {
	var bgType = newBackground.split(":")[0];
	var bgVal = newBackground.split(":")[1];
	if (bgType == "img") {
		document.getElementById("app").style.backgroundImage = "url(img/backgrounds/bg" + bgVal + ".jpg)"
		MyHomeworkSpace.Nav.inverted = false;
	} else if (bgType == "clr") {
		document.getElementById("app").style.backgroundImage = "none";
		document.getElementById("app").style.backgroundColor = bgVal;

		// text adjustment code
		// this will check if the color is bright, and if it is, invert the color of the tabs and navbar
		var newClr = bgVal.substr(1); // we are assuming it's in format #rrggbb
		// convert hex code into numbers
		var red = parseInt(newClr.substr(0, 2), 16);
		var green = parseInt(newClr.substr(2, 2), 16);
		var blue = parseInt(newClr.substr(4, 2), 16);

		if (red > 128 || green > 128 || blue > 128) {
			MyHomeworkSpace.Nav.inverted = true;
		} else {
			MyHomeworkSpace.Nav.inverted = false;
		}
	}
	currentBackground = newBackground;
	MyHomeworkSpace.Nav.rerenderNav();
};

var renderModalManager = function() {
	render(h(ModalManager, {
		modalName: modalName,
		modalState: modalState,
		openModal: openModal,

		classes: MyHomeworkSpace.Classes.list,
		refreshClasses: refreshClasses,

		currentBackground: currentBackground,
		setBackground: setBackground
	}), null, document.querySelector("#modalManager > div"));
};

var openModal = function(name, state) {
	modalName = name;
	modalState = state;
	renderModalManager();
	if (modalName != "") {
		document.getElementById("app").classList.add("modal-open");
	} else {
		document.getElementById("app").classList.remove("modal-open");
	}
};

export default {
	api: api,
	errors: errors,
	prefixes: prefixes,
	quickAdd: quickAdd,

	init: function() {
		renderModalManager();
	},

	openModal: openModal,

	background: {
		currentBackground: currentBackground,
		isDimBackground: isDimBackground,
		setBackground: setBackground
	},

	auth: {
		ApplicationAuthForm: ApplicationAuthForm,
		CreateAccountForm: CreateAccountForm,
		CompleteEmailForm: CompleteEmailForm,
		LoginForm: LoginForm,
		ResetPasswordForm: ResetPasswordForm
	},

	pages: {
		calendar: {
			CalendarPage: CalendarPage
		},
		help: {
			HelpPage: HelpPage
		},
		homework: {
			HomeworkPage: HomeworkPage
		},
		classes: {
			ClassesPage: ClassesPage
		},
		admin: {
			AdminPage: AdminPage
		},
		planner: {
			PlannerPage: PlannerPage
		},
		settings: {
			SettingsPage: SettingsPage
		}
	},

	ui: {
		AddAction: AddAction,
		ClassName: ClassName,
		DateHeader: DateHeader,
		FeedbackControl: FeedbackControl,
		HomeworkName: HomeworkName,
		TopBar: TopBar
	},

	// functions from preact
	h: h,
	render: render
};