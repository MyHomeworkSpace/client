import "settings/panes/applications/MyApplications.styl";

import { h, Component } from "preact";

import api from "api.js";

import MyApplicationListItem from "settings/panes/applications/MyApplicationListItem.jsx";

export default class MyApplications extends Component {
	constructor() {
		super();
		this.state = {
			loading: true,
			applications: []
		};
	}

	componentDidMount() {
		this.refresh();
	}

	refresh(callback) {
		this.setState({
			loading: true
		}, () => {
			api.get("application/manage/getAll", {}, (data) => {
				this.setState({
					loading: false,
					applications: data.applications
				}, callback);
			});
		});
	}

	createApplication() {
		api.post("application/manage/create", {}, () => {
			this.refresh();
		});
	}

	render(props, state) {
		if (state.loading) {
			return <div class="myApplications loading"><i class="fa fa-refresh fa-spin"></i> Loading, please wait...</div>;
		}
		if (state.applications.length == 0) {
			return <div>
				<button class="btn btn-primary" onClick={this.createApplication.bind(this)}><i class="fa fa-plus"></i> Create application</button>
				<div class="myApplications empty">You haven't created any applications.</div>
			</div>;
		}

		let authorizations = state.applications.map((application, i) => {
			return <MyApplicationListItem application={application} key={i} refresh={this.refresh.bind(this)} openModal={props.openModal} />;
		});
		return <div>
			<button class="btn btn-primary" onClick={this.createApplication.bind(this)}><i class="fa fa-plus"></i> Create application</button>
			<div class="myApplications">{authorizations}</div>
		</div>;
	}
};