import "ui/AddActionCalendarInfo.styl";

import { h } from "preact";

import consts from "consts.js";

import AddActionInfo from "ui/AddActionInfo.jsx";

export default function AddActionCalendarInfo(props) {
	return <AddActionInfo class="addActionCalendarInfo">
		<div class="addActionCalendarInfoText">Where is your event from?</div>
		<div class="addActionCalendarInfoBtn" onClick={() => {
			this.props.openModal("calendarEvent", {
				type: consts.EVENT_TYPE_HOMEWORK
			});
			this.props.close();
		}}>
			<div class="addActionCalendarInfoBtnInfo">
				<div class="addActionCalendarInfoBtnIcon"><i class="fa fa-book" /></div>
				<div class="addActionCalendarInfoBtnLabel">Add from homework</div>
			</div>
		</div>
		<div class="addActionCalendarInfoBtn" onClick={() => {
			this.props.openModal("calendarEvent", {
				type: consts.EVENT_TYPE_PLAIN
			});
			this.props.close();
		}}>
			<div class="addActionCalendarInfoBtnInfo">
				<div class="addActionCalendarInfoBtnIcon"><i class="fa fa-plus" /></div>
				<div class="addActionCalendarInfoBtnLabel">Create new</div>
			</div>
		</div>
	</AddActionInfo>;
};