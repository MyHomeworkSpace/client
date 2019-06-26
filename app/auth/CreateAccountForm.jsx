import "auth/CreateAccountForm.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";
import errors from "errors.js";

import LoadingIndicator from "ui/LoadingIndicator.jsx";

export default class CreateAccountForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			email: "",
			password: "",
			passwordConf: ""
		};
	}

	create() {

	}

	keyup(e) {
		if (e.keyCode == 13) {
			this.create();
		}
	}

	render(props, state) {
		return <div class="fullForm">
			<div class="fullFormTitle">Create account</div>

			{state.error && <div class="alert alert-danger">{state.error}</div>}
			<div class="input-group no-addon">
				<input type="email" class="form-control" placeholder="Email address" onKeyup={this.keyup.bind(this)} onChange={linkState(this, "email")} value={state.email} disabled={state.loading} />
			</div>
			<div class="input-group no-addon">
				<input type="password" class="form-control" placeholder="Password" onKeyup={this.keyup.bind(this)} onChange={linkState(this, "password")} value={state.password} disabled={state.loading} />
			</div>
			<div class="input-group no-addon">
				<input type="password" class="form-control" placeholder="Password (again)" onKeyup={this.keyup.bind(this)} onChange={linkState(this, "passwordConf")} value={state.passwordConf} disabled={state.loading} />
			</div>

			<button class="btn btn-lg btn-primary pull-right" onClick={this.create.bind(this)} disabled={state.loading}>
				{state.loading ? <LoadingIndicator /> : "Create account"}
			</button>

			<div class="clearfix"></div>
		</div>;
	}
}