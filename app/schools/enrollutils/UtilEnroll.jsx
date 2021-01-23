import "schools/cornell/CornellEnroll.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";
import errors from "errors.js";

export default class HogwartsEnroll extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			error: "",

			house: "",
		};
	}

	login() {
		if (this.state.house == "") {
			this.setState({
				error: "You must select a house to continue."
			});
			return;
		}

		this.setState({
			loading: true
		}, () => {
			api.post("prefs/set", {
				key: "hogwartsHouse",
				value: this.state.house
			}, (data) => {
				if (data.status == "ok") {
					this.props.next();
				} else {
					this.setState({
						loading: false,
						error: errors.getFriendlyString(data.error)
					});
				}
			});
		});
	}

	onKeyUp(e) {
		if (e.keyCode == 13) {
			this.login();
		}
	}

	update(event) {
		this.setState({
			house: event.target.value
		});
	}

	render(props, state) {
		return <div class="cornellEnroll">
			{state.error && <div class="alert alert-danger">{state.error}</div>}
			<p>Select your house to continue.</p>
			<div class="radio">
				<label><input type="radio" name="house" value="gryffindor" onChange={this.update.bind(this)} />Gryffindor</label>
			</div>
			<div class="radio">
				<label><input type="radio" name="house" value="hufflepuff" onChange={this.update.bind(this)} />Hufflepuff</label>
			</div>
			<div class="radio">
				<label><input type="radio" name="house" value="ravenclaw" onChange={this.update.bind(this)} />Ravenclaw</label>
			</div>
			<div class="radio">
				<label><input type="radio" name="house" value="slytherin" onChange={this.update.bind(this)} />Slytherin</label>
			</div>
			<div class="form-group actions">
				{state.loading && <span><i class="fa fa-circle-o-notch fa-spin fa-fw"></i> Joining house...</span>}
				<button class="btn btn-default" onClick={props.prev} disabled={state.loading}><i class="fa fa-chevron-left" /></button>
				<button class="btn btn-primary" onClick={this.login.bind(this)} disabled={state.loading}>Continue <i class="fa fa-chevron-right" /></button>
			</div>

		</div>;
	}
};