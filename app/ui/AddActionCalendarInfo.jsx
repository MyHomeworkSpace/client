import "ui/AddActionCalendarInfo.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import AddActionInfo from "ui/AddActionInfo.jsx";
import HomeworkName from "ui/HomeworkName.jsx";

class AddActionCalendarInfo extends Component {
	addFromHomework() {
		this.props.close();
	}

	createNew() {
		this.props.openModal("calendarEvent", {});
		this.props.close();
	}

	render(props, state) {
		return <AddActionInfo class="addActionCalendarInfo">
			<div class="addActionCalendarInfoText">Where is your event from?</div>
			<div class="addActionCalendarInfoBtn" onClick={this.addFromHomework.bind(this)}>
				<div class="addActionCalendarInfoBtnInfo">
					<div class="addActionCalendarInfoBtnIcon"><i class="fa fa-book" /></div>
					<div class="addActionCalendarInfoBtnLabel">Add from homework</div>
				</div>
			</div>
			<div class="addActionCalendarInfoBtn" onClick={this.createNew.bind(this)}>
				<div class="addActionCalendarInfoBtnInfo">
					<div class="addActionCalendarInfoBtnIcon"><i class="fa fa-plus" /></div>
					<div class="addActionCalendarInfoBtnLabel">Create new</div>
				</div>
			</div>
		</AddActionInfo>;
	}
}

export default AddActionCalendarInfo;