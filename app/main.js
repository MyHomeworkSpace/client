import { h, render } from "preact";

import api from "api.js";

import ApplicationList from "settings/ApplicationList.jsx";

export default {
	api: api,

	pages: {
		settings: {
			ApplicationList: ApplicationList
		}
	},

	// functions from preact
	h: h,
	render: render
};