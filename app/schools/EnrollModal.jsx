import "schools/EnrollModal.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";
import consts from "consts.js";
import errors from "errors.js";

import DaltonEnroll from "schools/dalton/DaltonEnroll.jsx";
import MITEnroll from "schools/mit/MITEnroll.jsx";

import LoadingIndicator from "ui/LoadingIndicator.jsx";
import Modal from "ui/Modal.jsx";

/*
 * steps:
 * 0 = enter email
 * 1 = results of email search
 * 2 = school specific enrollment (logging in to school account or w/e)
 * 3 = enrollment success page
 */

var enrollComponents = {
	dalton: DaltonEnroll,
	mit: MITEnroll
};

export default class EnrollModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			error: "",

			email: "",
			step: 0
		};
	}

	componentDidMount() {
		var that = this;
		if (this.props.modalState.email) {
			this.setState({
				email: this.props.modalState.email
			}, function() {
				that.submitEmail.call(that, this.props.modalState.reenroll);
			});
		}
	}

	submitEmail(skipFoundStep) {
		if (this.state.email == "") {
			this.setState({
				error: "You must enter your school email address."
			});
			return;
		}

		// quality email validation
		// we only really care about the domain so it's ok
		if (this.state.email.indexOf("@") == -1) {
			this.setState({
				error: "You must enter a valid email address."
			});
			return;
		}

		var that = this;
		this.setState({
			loading: true,
			error: ""
		}, function() {
			api.get("schools/lookup", {
				email: this.state.email
			}, function(data) {
				if (data.status == "ok") {
					that.setState({
						loading: false,
						step: (skipFoundStep ? 2 : 1),
						school: data.school
					});
				} else {
					that.setState({
						loading: false,
						error: errors.getFriendlyString(data.error)
					});
				}
			});
		});
	}

	prev() {
		if (this.state.step == 1 || this.state.step == 2) {
			this.setState({
				step: this.state.step - 1
			});
		}
	}

	next() {
		if (this.state.step == 0) {
			this.submitEmail(false);
		} else if (this.state.step == 1 || this.state.step == 2) {
			this.setState({
				step: this.state.step + 1
			});
		}
	}

	done() {
		if (this.state.step == 1) {
			// no school, just close it
			this.props.openModal("");
		} else if (this.state.step == 3) {
			// need to reload
			// TODO: can we force a new request to auth/me from here? maybe wait for more of the app to become preacty?
			window.location.reload();
		}
	}

	onKeyUp(e) {
		if (e.keyCode == 13) {
			this.next();
		}
	}

	render(props, state) {
		var title = "Connect school account";
		if (this.state.step > 1) {
			// we know what school the user is enrolling in
			title = "Connect to " + state.school.displayName;
		}

		if (state.loading) {
			return <Modal title={title} openModal={props.openModal} noClose class="enrollModal">
				<div class="modal-body">
					<LoadingIndicator type="inline" /> Loading, please wait...
				</div>
			</Modal>;
		}

		var contents;
		var canBack;
		var canNext;
		var showDone;
		var showFooter = true;
		if (state.step == 0) {
			canBack = false;
			canNext = true;
			showDone = false;
			contents = <div>
				<div>Enter your school email address and we'll check if we support your school.</div>
				<input
					type="email"
					class="form-control enrollModalEmail"
					placeholder="School email"
					onKeyUp={this.onKeyUp.bind(this)}
					onChange={linkState(this, "email")}
					value={state.email}
					disabled={state.loading}
				/>
			</div>;
		} else if (state.step == 1) {
			if (state.school) {
				canBack = true;
				canNext = true;
				showDone = false;
				contents = <div>
					We detected this email as part of <strong>{state.school.displayName}</strong>, which we're able to automatically get your data from! To continue, click Next below.
				</div>;
			} else {
				canBack = true;
				canNext = false;
				showDone = true;
				contents = <div>
					Unfortunately, it looks like we currently don't support your school. You can still use Calendar and the rest of MyHomeworkSpace, but we won't be able to automatically import your class and schedule information. Check back later, or email us at <a href="mailto:hello@myhomework.space">hello@myhomework.space</a> if you'd like to suggest that we add your school!
				</div>;
			}
		} else if (state.step == 2) {
			var enrollComponent = enrollComponents[state.school.schoolID];

			showFooter = false;
			contents = h(enrollComponent, {
				email: state.email,

				reenroll: !!this.props.modalState.reenroll,

				prev: this.prev.bind(this),
				next: this.next.bind(this)
			});
		} else if (state.step == 3) {
			canBack = false;
			canNext = false;
			showDone = true;
			contents = <div>
				Your account with <strong>{state.school.displayName}</strong> has been connected!
			</div>;
		}

		return <Modal title={title} openModal={props.openModal} class="enrollModal">
			<div class="modal-body">
				{state.error && <div class="alert alert-danger">{state.error}</div>}
				{contents}
			</div>
			{showFooter && <div class="modal-footer">
				{canBack && <button type="button" class="btn btn-default" onClick={this.prev.bind(this)}><i class="fa fa-chevron-left" /></button>}
				{canNext && <button type="button" class="btn btn-primary" onClick={this.next.bind(this)}>Next <i class="fa fa-chevron-right" /></button>}
				{showDone && <button type="button" class="btn btn-primary" onClick={this.done.bind(this)}>Done</button>}
			</div>}
		</Modal>;
	}
};