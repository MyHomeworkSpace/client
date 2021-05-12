import "settings/panes/account/SchoolList.styl";

import { h, Component } from "preact";

import api from "api.js";

export default class SchoolList extends Component {
	settings(school) {
		this.props.openModal("schoolSettings", {
			school: school
		});
	}

	disconnect(school) {
		if (confirm(`Disconnect ${school.displayName} from your account? You'll still be able to access your Calendar, but any events from ${school.displayName} will be gone.`)) {
			this.setState({
				loading: true
			}, () => {
				api.post("schools/unenroll", {
					school: school.schoolID
				}, (data) => {
					this.props.refreshContext(() => {
						this.setState({
							loading: false
						});
					});
				});
			});
		}
	}

	setEnabled(school, enabled) {
		let message = `Disable ${school.displayName}? It won't appear in your Calendar, but you'll be able to re-enable it at any time.`;
		if (enabled) {
			message = `Enable ${school.displayName}?`;
		}

		if (confirm(message)) {
			this.setState({
				loading: true
			}, () => {
				api.post("schools/setEnabled", {
					school: school.schoolID,
					enabled: enabled
				}, (data) => {
					this.props.refreshContext(() => {
						this.setState({
							loading: false
						});
					});
				});
			});
		}
	}

	render(props, state) {
		if (props.me.schools.length == 0) {
			return <div class="schoolList none">
				You haven't connected any school accounts to MyHomeworkSpace.
			</div>;
		}

		return <div class="schoolList">
			{props.me.schools.map((school) => {
				return <div class={`schoolItem ${school.enabled ? "" : "disabled"}`}>
					<div class="schoolData pull-left">
						<div class="schoolName">{school.displayName} {!school.enabled && " (disabled)"}</div>
						{school.enabled && <div class="schoolDetails">{school.userDetails}</div>}
						{!school.enabled && <div>This school has been disabled. It won't appear in your Calendar.</div>}
					</div>
					<div class="schoolActions pull-right">
						{school.enabled && <button class="btn btn-primary" onClick={this.settings.bind(this, school)} disabled={state.loading}><i class="fa fa-fw fa-gear" /> Settings</button>}
						<button class={`btn btn-${school.enabled ? "default": "primary"}`} onClick={this.setEnabled.bind(this, school, !school.enabled)} disabled={state.loading}><i class="fa fa-fw fa-power-off" /> {school.enabled ? "Disable" : "Enable"}</button>
						<button class="btn btn-danger" onClick={this.disconnect.bind(this, school)} disabled={state.loading}><i class="fa fa-fw fa-chain-broken" /> Disconnect</button>
					</div>
					<div class="schoolClear"></div>
				</div>;
			})}
		</div>;
	}
};