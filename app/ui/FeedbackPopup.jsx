import "ui/FeedbackPopup.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";

import LoadingIndicator from "ui/LoadingIndicator.jsx";

class FeedbackPopup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			type: "",
			message: "",
			error: false,
			loading: false,
			sent: false,
			screenshot: null
		};
	}

	selectFeeling(type) {
		this.setState({
			type: type
		}, function() {
			document.querySelector(".feedbackPopupMessage").focus();
		});
	}

	submit() {
		var that = this;
		if (this.state.message.trim() == "") {
			this.setState({
				error: true
			}, function() {
				document.querySelector(".feedbackPopupMessage").focus();
			});
			return;
		}
		this.setState({
			loading: true,
			error: false
		}, function() {
			api.post("feedback/add", {
				type: that.state.type,
				text: that.state.message,
				screenshot: that.state.screenshot
			}, function() {
				that.setState({
					loading: false,
					sent: true
				});
			});
		});
	}

	keyup() {
		if (this.state.error) {
			this.setState({
				error: false
			});
		}
	}

	takeScreenshot() {
		if (this.state.screenshot) {
			this.setState({
				screenshot: null
			});
			return;
		}

		/* Load asynchronously because it's a big file */
		this.setState({
			loading: true,
		});
		new Promise(function(resolve, reject) {
			var s;
			s = document.createElement("script");
			s.src = "https://html2canvas.hertzen.com/dist/html2canvas.min.js";
			s.onload = resolve;
			s.onerror = reject;
			document.head.appendChild(s);
		}).then(
			() => html2canvas(document.body, { scale: window.devicePixelRatio / 3 }).then(canvas => {
				this.setState({
					screenshot: canvas.toDataURL(),
					loading: false
				});
			}),
			(r) => {
				alert("Error generating screenshot. Submitting feedback without screenshot.");
				this.setState({
					loading: false
				});
			}
		);
	}

	render(props, state) {
		if (state.sent) {
			return <span class="feedbackPopup feedbackPopupExtended feedbackPopupSuccess">
				<div class="feedbackPopupHeading">Thanks for the feedback!</div>
				<p>Your feedback has been successfully sent. While we read each feedback that we receive, we might not be able to get back to you.</p>
			</span>;
		}

		var feelingIndicator = <div class="feedbackPopupFeeling">
			<div class="feedbackPopupHeading">How do you feel?</div>
			<div class={`feedbackPopupFeelingOption ${state.type == "smile" ? "selected" : ""}`} onClick={this.selectFeeling.bind(this, "smile")}><i class="fa fa-fw fa-smile-o" /> I'm happy</div>
			<div class={`feedbackPopupFeelingOption ${state.type == "frown" ? "selected" : ""}`} onClick={this.selectFeeling.bind(this, "frown")}><i class="fa fa-fw fa-frown-o" /> I'm sad</div>
			<div class={`feedbackPopupFeelingOption ${state.type == "idea" ? "selected" : ""}`} onClick={this.selectFeeling.bind(this, "idea")}><i class="fa fa-fw fa-lightbulb-o" /> I have an idea</div>
		</div>;

		if (state.type == "") {
			return <span class="feedbackPopup">
				{feelingIndicator}
			</span>;
		} else {
			return <span class={`feedbackPopup feedbackPopupExtended ${state.error ? "has-error" : ""}`}>
				<div class="row">
					<div class="feedbackPopupCol col-md-5 feedbackPopupFeeling">
						{feelingIndicator}
					</div>
					<div class="feedbackPopupCol col-md-7 feedbackPopupMessageContainer">
						<div class="feedbackPopupHeading">Tell us more...</div>
						<textarea class="feedbackPopupMessage form-control" disabled={state.loading} value={state.message} onInput={linkState(this, "message")} onKeyup={this.keyup.bind(this)}></textarea>
						{state.screenshot ? <img src={state.screenshot} class="feedbackPopupScreenshotImg" /> : null}
						<small class="finetext">Your name will also be sent. {state.screenshot ? <span>
							Use of the screenshot you included is subject to our <a href="https://legal.myhomework.space/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
						</span> : null}</small>
						<button
							class="btn btn-default btn-sm addScreenshotButton"
							name="screenshot"
							type="checkbox"
							onClick={this.takeScreenshot.bind(this)}>
							{state.screenshot ? "Remove Screenshot" : "Add a Screenshot"}
						</button>
						{!state.loading && <button class="btn btn-primary btn-sm feedbackSubmitButton" onClick={this.submit.bind(this)}>Submit</button>}
						{state.loading && <button class="btn btn-primary btn-sm feedbackSubmitButton" disabled={true}><LoadingIndicator type="inline" /> Loading...</button>}
					</div>
				</div>
			</span >;
		}
	}
}

export default FeedbackPopup;