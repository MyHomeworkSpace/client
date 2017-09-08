import { h, render } from "preact";

import api from "api.js";
import errors from "errors.js";

import CalendarPage from "calendar/CalendarPage.jsx";

import HomeworkItem from "homework/HomeworkItem.jsx";

import ApplicationList from "settings/ApplicationList.jsx";
import CalendarSettings from "settings/CalendarSettings.jsx";

import AddAction from "ui/AddAction.jsx";
import FeedbackControl from "ui/FeedbackControl.jsx";
import ModalManager from "ui/ModalManager.jsx";

import Sidebar from "ui/nav/Sidebar.jsx";
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

var setBackground = function(newBackground) {
	var bgType = newBackground.split(":")[0];
	var bgVal = newBackground.split(":")[1];
	if (bgType == "img") {
		$("body").css("background-image", "url(img/backgrounds/bg" + bgVal + ".jpg)");
		MyHomeworkSpace.Nav.inverted = false;
	} else if (bgType == "clr") {
		$("body").css("background-image", "none");
		$("body").css("background-color", bgVal);

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
		$("body").addClass("modal-open");
	} else {
		$("body").removeClass("modal-open");
	}
};

export default {
	api: api,
	errors: errors,

	init: function() {
		renderModalManager();
	},

	openModal: openModal,

	background: {
		currentBackground: currentBackground,
		setBackground: setBackground
	},

	pages: {
		calendar: {
			CalendarPage: CalendarPage
		},
		homework: {
			HomeworkItem: HomeworkItem
		},
		settings: {
			ApplicationList: ApplicationList,
			CalendarSettings: CalendarSettings
		}
	},

	ui: {
		AddAction: AddAction,
		FeedbackControl: FeedbackControl,
		Sidebar: Sidebar,
		TopBar: TopBar
	},

	// functions from preact
	h: h,
	render: render
};