import "ui/AddAction.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import AddActionHomeworkInfo from "ui/AddActionHomeworkInfo.jsx";

class AddAction extends Component {
	constructor(props) {
		super(props);
		this.state = {
			input: ""
		};
	}

	click() {
		// TODO: convert homework modal to preact, and then remove this icky DOM manipulation
		if (MyHomeworkSpace.Pages.settings.cache.disableQuickAdd) {
			// show the modal
			$("#homeworkName").val("");
			$("#homeworkClass").val(-1);
			$("#homeworkDue").val("");
			$("#homeworkDue").next(".form-control").children("button").text(moment().format("dddd, MMMM Do, YYYY"));
			$("#homeworkDue").next(".form-control").children("div").datepicker("setDate", moment().toDate());
			$("#homeworkComplete").prop("checked", false);
			$("#homeworkDesc").val("");
			$("#deleteHomeworkModal").hide();
			$("#homeworkModalType").text("Add");
			$("#homeworkModal").attr("data-actionType", "add");
			$("#homeworkName").trigger("input"); // trigger tag system
			$("#homeworkModal").modal();
		} else {
			// open the textbox
			this.setState({
				open: true,
				input: ""
			}, function() {
				document.querySelector(".addActionInput").focus();
			});
		}
	}

	close() {
		this.setState({
			open: false
		});
	}

	componentDidMount() {
		var that = this;
		Mousetrap.bind('ctrl+space', function(e) {
			that.click.bind(that)();
			return false;
		});
	}

	keyup(e) {
		if (e.keyCode == 13) {
			// TODO: convert homework modal to preact, and then remove this icky DOM manipulation
			var info = MyHomeworkSpace.QuickAdd.parseText(this.state.input);
			if (info.tag || info.name) {
				$("#homeworkName").val(info.tag + " " + info.name);
			} else {
				$("#homeworkName").val("");
			}
			$("#homeworkClass").val((info.classId ? info.classId : -1));
			var dueDate = MyHomeworkSpace.QuickAdd.parseDate(info.due) || undefined;
			$("#homeworkDue").val(dueDate);
			$("#homeworkDue").next(".form-control").children("button").text(moment(dueDate).format("dddd, MMMM Do, YYYY"));
			$("#homeworkDue").next(".form-control").children("div").datepicker("setDate", moment(dueDate).toDate());
			$("#homeworkComplete").prop("checked", false);
			$("#homeworkDesc").val("");
			$("#deleteHomeworkModal").hide();
			$("#homeworkModalType").text("Add");
			$("#homeworkModal").attr("data-actionType", "add");
			$("#homeworkName").trigger("input"); // trigger tag system
			$("#homeworkModal").modal();
			this.close();
		}
	}

	render(props, state) {
		return <span class="addAction">
			{!state.open && <div class="addActionButton" onClick={this.click.bind(this)}>
				<i class="fa fa-plus-square"></i> Add Homework
			</div>}
			{state.open && <div class="addActionText">
				<div class="addActionClose" onClick={this.close.bind(this)}>&times;</div>
				<input type="text" class="addActionInput" placeholder="just start typing..." onKeyup={this.keyup.bind(this)} onInput={linkState(this, "input")} value={state.input} />
			</div>}
			{state.open && <AddActionHomeworkInfo text={state.input} />}
		</span>;
	}
}

export default AddAction;