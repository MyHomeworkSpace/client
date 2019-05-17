import "ui/AddAction.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import consts from "consts.js";
import quickAdd from "quickAdd.js";

import AddActionCalendarInfo from "ui/AddActionCalendarInfo.jsx";
import AddActionHomeworkInfo from "ui/AddActionHomeworkInfo.jsx";

class AddAction extends Component {
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
		var that = this;
		Mousetrap.bind("ctrl+space", function() {
			that.click.call(that);
			return false;
		});
	}

	keyup(e) {
		if (e.keyCode == 13) {
			// TODO: convert homework modal to preact, and then remove this icky DOM manipulation
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
			{thingToAdd == consts.EVENT_TYPE_HOMEWORK && state.open && <div class="addActionText">
				<div class="addActionClose" onClick={this.close.bind(this)}><i class="fa fa-times"></i></div>
				<input type="text" autoComplete="off" class="addActionInput" placeholder="just start typing..." onKeyup={this.keyup.bind(this)} onInput={linkState(this, "input")} value={state.input} />
			</div>}
			{thingToAdd == consts.EVENT_TYPE_HOMEWORK && state.open && <AddActionHomeworkInfo text={state.input} close={this.close.bind(this)} openModal={props.openModal} />}
			{thingToAdd == consts.EVENT_TYPE_PLAIN && state.open && <div class="addActionButton" onClick={this.close.bind(this)}>
				<i class="fa fa-times"></i> Close
			</div>}
			{thingToAdd == consts.EVENT_TYPE_PLAIN && state.open && <AddActionCalendarInfo text={state.input} close={this.close.bind(this)} openModal={props.openModal} />}
		</div>;
	}
}

export default AddAction;