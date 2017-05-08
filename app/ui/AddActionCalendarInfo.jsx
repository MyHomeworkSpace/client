import "ui/AddActionCalendarInfo.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import AddActionInfo from "ui/AddActionInfo.jsx";
import HomeworkName from "ui/HomeworkName.jsx";

class AddActionCalendarInfo extends Component {
	render(props, state) {
		return <AddActionInfo class="addActionCalendarInfo">
			<div class="addActionCalendarInfoText">Where is your event from?</div>
			<div class="addActionCalendarInfoBtn">
				<div class="addActionCalendarInfoBtnInfo">
					<div class="addActionCalendarInfoBtnIcon"><i class="fa fa-book" /></div>
					<div class="addActionCalendarInfoBtnLabel">Add from homework</div>
				</div>
			</div>
			<div class="addActionCalendarInfoBtn">
				<div class="addActionCalendarInfoBtnInfo">
					<div class="addActionCalendarInfoBtnIcon"><i class="fa fa-plus" /></div>
					<div class="addActionCalendarInfoBtnLabel">Create new</div>
				</div>
			</div>
		</AddActionInfo>;
		if (props.text.trim() == "") {
			return <AddActionInfo>
				<p>Type your calendary stuff in the textbox above.</p>
			</AddActionInfo>;
		}
		var info = MyHomeworkSpace.QuickAdd.parseText(props.text);
		return <AddActionInfo class="addActionCalendarInfo">
			<p>asdf</p>
		</AddActionInfo>;
	}
}

export default AddActionCalendarInfo;