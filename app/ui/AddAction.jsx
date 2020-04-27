import "ui/AddAction.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import moment from "moment";

import consts from "consts.js";
import quickAdd from "quickAdd.js";

import AddActionCalendarInfo from "ui/AddActionCalendarInfo.jsx";
import AddActionHomeworkInfo from "ui/AddActionHomeworkInfo.jsx";

export default class AddAction extends Component {
	constructor(props) {
		super(props);
		this.state = {
			input: ""
		};
	}

	click() {
		if (MyHomeworkSpace.Pages.settings.cache.disableQuickAdd && this.props.page != "calendar") {
			// show the modal
			MHSBridge.default.openModal("homework", {});
		} else {
			// open the textbox
			this.setState({
				open: true,
				input: ""
			}, function() {
				if (this.props.page != "calendar") {
					document.querySelector(".addActionInput").focus();
				}
			});
		}
	}

	close(e) {
		if (e) {
			e.stopPropagation();
		}
		this.setState({
			open: false
		});
	}

	componentDidMount() {
		Mousetrap.bind(["ctrl+space", "q"], () => {
			this.click();
			return false;
		});
	}

	keyup(e) {
		if (e.keyCode == 13) {
			var info = quickAdd.parseText(this.state.input);
			var dueDate = quickAdd.parseDate(info.due) || undefined;

			var hwName = "";

			if (info.tag || info.name) {
				hwName = info.tag + " " + info.name;
			}

			MHSBridge.default.openModal("homework", {
				name: hwName,
				due: (dueDate ? moment(dueDate).format("YYYY-MM-DD") : null),
				classId: (info.class ? info.class.id : -1)
			});
			this.close();
		}
	}

	render(props, state) {
		var thingToAdd = (props.page == "calendar" ? consts.EVENT_TYPE_PLAIN : consts.EVENT_TYPE_HOMEWORK);
		return <div class="addAction">
			{!state.open && <div class="addActionButton" onClick={this.click.bind(this)}>
				<i class="fa fa-plus-square"></i> Add {thingToAdd == consts.EVENT_TYPE_PLAIN ? "event": "homework"}
			</div>}
			{thingToAdd == consts.EVENT_TYPE_HOMEWORK && state.open && <form class="addActionText">
				<div class="addActionClose" onClick={this.close.bind(this)}><i class="fa fa-times"></i></div>
				<input type="text" autoComplete="nope" class="addActionInput" placeholder="just start typing..." onKeyup={this.keyup.bind(this)} onInput={linkState(this, "input")} value={state.input} />

				{/*
					the following text input serves absolutely no purpose,
					other than to make chrome decide not to autofill the quick add input
					for whatever reason, it think it's smarter than the websites it visits,
					and IGNORES autocomplete settings when they're applied to all inputs in a form
					so, we make a fake input in order to trick it.

					it also ignores the standard autocomplete="off", needing a random string instead.

					tl;dr: google chrome is an awful browser and it makes me sad
					see: https://bugs.chromium.org/p/chromium/issues/detail?id=468153#c164
					see: https://stackoverflow.com/questions/47775041/disable-autofill-in-chrome-63
				*/}
				<input style="display: none" type="text" name="chrome-is-an-awful-browser-please-do-not-use-it" />
			</form>}
			{thingToAdd == consts.EVENT_TYPE_HOMEWORK && state.open && <AddActionHomeworkInfo text={state.input} close={this.close.bind(this)} openModal={props.openModal} />}
			{thingToAdd == consts.EVENT_TYPE_PLAIN && state.open && <div class="addActionButton" onClick={this.close.bind(this)}>
				<i class="fa fa-times"></i> Close
			</div>}
			{thingToAdd == consts.EVENT_TYPE_PLAIN && state.open && <AddActionCalendarInfo text={state.input} close={this.close.bind(this)} openModal={props.openModal} />}
		</div>;
	}
};