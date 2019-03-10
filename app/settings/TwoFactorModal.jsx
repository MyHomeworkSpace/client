import "settings/TwoFactorModal.styl"

import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";

import Modal from "ui/Modal.jsx"
import LoadingIndicator from '../ui/LoadingIndicator.jsx';

class BackgroundModal extends Component {
	constructor() {
		super();
		this.state = {
			disableConfirm: false,
			disableCode: "",
			disabled: false,
			enablePhase: 1,
			enableCode: "",
			error: "",
		}
	}

	disable2FA() {
		if (this.state.disabled) {
			document.location.reload()
			return
		}
		api.post("auth/disableTOTP", {
			code: this.state.disableCode
		}, (data) => {
			if (data.status != "ok") {
				this.setState({
					error: "An error occured. Are you sure that you have the right code?"
				})
			} else {
				MyHomeworkSpace.Me.twoFactorEnabled == false;
				this.setState({
					disabled: true,
					error: ""
				})
			}
		})
	}

	close() {
		this.props.openModal("");
	}

	startEnrollment() {
		let that = this;
		api.post("auth/enableTOTP", {}, (enableResponse) => {
			that.setState({
				enrollmentMaterials: enableResponse
			})
			this.bumpPhase()
		})
	}

	renderCorrectPhase() {
		if (this.state.enablePhase == 1) {
			return <div>
				<div class="modal-body">
					<p>Two-Factor Authentication is a method of securing your MyHomeworkSpace account by adding an additional layer of security. The common first layer is
					"Something you know," like a password, which is required for all MyHomeworkSpace accounts. The second layer, "Something you have," is optional, but reccomended
					to secure your account.</p>
					<p>Two-Factor Authentication uses TOTP, or Time-based One Time Password. An authentication app on your phone, or another device, generates a different password
					every 30 seconds. When logging into MyHomeworkSpace, you will be asked to provde this password in addition to your regular account password.</p>
					<p>You will be provided with an emergency key. Keep this key in a safe place and do not share it, as it can be used to bypass two-factor authentication without
					a one time password.</p>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" onClick={this.bumpPhase.bind(this)}>Next</button>
				</div>
			</div>
		} else if (this.state.enablePhase == 2) {
			this.startEnrollment();
			return <div>
				<div class="modal-body">
					<p><LoadingIndicator /> Requesting enrollment materials from server...</p>
				</div>
				{/* <div class="modal-footer">
					<button type="button" class="btn btn-primary" onClick={this.bumpPhase.bind(this)}>Next</button>
				</div> */}
			</div>
		} else if (this.state.enablePhase == 3) {
			return <div>
				<div class="modal-body">
					<p>If you don't have one already, now is the time to download an authenticator app. The ones that we like over here are
				Google Authenticator, LastPass Authenticator, Authy, and 1Password, but there are many that you can choose from.</p>
					<p>Once you've downloaded an authenticator app, scan the barcode below. Alternatively, you can enter your emergency key into
				the authenticator app.</p>

					<img height="200" width="200" class="twoFactorBarcodeImage" src={this.state.enrollmentMaterials.qr}></img>

					<p><strong>EMERGENCY KEY:</strong> <code>{this.state.enrollmentMaterials.emergency}</code></p>
				</div>
				<div class="modal-footer">
					<p>By clicking next, I confirm that I have written down my<br />emergency key and stored it in a safe place.</p>
					<button type="button" class="btn btn-primary" onClick={this.bumpPhase.bind(this)}>Next</button>
				</div>
			</div>
		} else if (this.state.enablePhase == 4) {
			return <div>
				<div class="modal-body">
					{this.state.error && <div class="alert alert-danger">{this.state.error}</div>}
					<p>Now we just need to confirm that everything worked.</p>

					<p>Enter the code that your authentication app generated below.</p>
					<div class="input-group">
						<input type="text" class="form-control" placeholder="Authentication Code" onChange={linkState(this, "enableCode")} value={this.state.enableCode} />
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" onClick={this.decrementPhase.bind(this)}>Back</button>
					<button type="button" class="btn btn-danger" onClick={this.close.bind(this)}>Cancel</button>
					<button type="button" class="btn btn-primary" onClick={this.checkEnrollmentCode.bind(this)}>Check code</button>
				</div>
			</div>
		} else if (this.state.enablePhase == 5) {
			return <div>
				<div class="modal-body">
					<p>Two factor authentication is now enabled for your account.</p>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" onClick={this.refreshPage()}>Done</button>
				</div>
			</div>
		}
	}

	bumpPhase() {
		let phase = this.state.enablePhase;
		this.setState({
			enablePhase: phase + 1
		})
		console.log(phase + 1)
	}

	decrementPhase() {
		let phase = this.state.enablePhase;
		this.setState({
			enablePhase: phase - 1
		})
	}

	checkEnrollmentCode() {
		api.post("auth/verifyTOTP", {
			code: this.state.enableCode
		}, (data) => {
			if (data.status != "ok") {
				if (data.error == "incorrect_code") {
					this.setState({
						error: "That code is incorrect. Please try again."
					})
					return
				}
				this.setState({
					error: "An internal server error occured."
				})
			} else {
				MyHomeworkSpace.Me.twoFactorEnabled == true;
				this.bumpPhase();
			}
		})
	}

	refreshPage() {
		document.location.reload()
	}

	render(props, state) {
		if (props.twoFactorEnabled == 1) {
			return <Modal title="Disable Two-Factor Authentication" openModal={props.openModal} noClose={!state.disabled}>
				<div class="modal-body">
					{state.error && <div class="alert alert-danger">{state.error}</div>}
					{!state.disabled ? <p><strong>Disabling Two-Factor authentication reduces the security of your account.</strong> If you are sure that you would like to proceed,
					enter your two factor authentication code and click confirm.</p> : <p>Two factor authentication has been disabled. You can re-enable it at any time from
					the settings page.</p>}

					{!state.disabled ? <div class="input-group">
						<input type="text" class="form-control" placeholder="Authentication Code" onChange={linkState(this, "disableCode")} value={state.disableCodes} />
					</div> : null}
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" onClick={this.disable2FA.bind(this)}>{state.disabled ? "Done" : "Confirm"}</button>
					{state.disabled ? null : <button type="button" class="btn btn-default" onClick={this.close.bind(this)}>Cancel</button>}
				</div>
			</Modal>
		}

		return <Modal title="Enable Two-Factor Authentication" openModal={props.openModal} class="backgroundModal" noClose={true}>
			{this.renderCorrectPhase()}
		</Modal>;
	}
}

export default BackgroundModal;