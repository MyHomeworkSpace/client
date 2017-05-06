import { h, render } from "preact";

import api from "api.js";
import errors from "errors.js";

import CalendarPage from "calendar/CalendarPage.jsx";

import ApplicationList from "settings/ApplicationList.jsx";

import ModalManager from "ui/ModalManager.jsx";

var modalName = "";
var modalState = {};

var refreshClasses = function(callback) {
	MyHomeworkSpace.Classes.load(function() {
		MyHomeworkSpace.Classes.reload();
		MyHomeworkSpace.Page.show("classes");
		callback();
	});
};

var renderModalManager = function() {
	render(h(ModalManager, {
		modalName: modalName,
		modalState: modalState,
		openModal: openModal,

		classes: MyHomeworkSpace.Classes.list,
		refreshClasses: refreshClasses
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

	pages: {
		calendar: {
			CalendarPage: CalendarPage
		},
		settings: {
			ApplicationList: ApplicationList
		}
	},

	// functions from preact
	h: h,
	render: render
};