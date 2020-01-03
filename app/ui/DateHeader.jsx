import "ui/DateHeader.styl";

import { h, Component } from "preact";

import moment from "moment";

import DatePicker from "ui/DatePicker.jsx";
import LoadingIndicator from "ui/LoadingIndicator.jsx";

export default class DateHeader extends Component {
	jumpBlock(blockAmount) {
		if (this.props.type == "week") {
			this.props.loadWeek(moment(this.props.start).add(blockAmount, this.props.type));
		} else if (this.props.type == "month") {
			this.props.loadMonth(moment(this.props.start).add(blockAmount, this.props.type));
		}
	}

	jumpToDate(date) {
		if (this.props.type == "week") {
			var mondayDate = moment(date);
			while (mondayDate.day() != 1) {
				mondayDate.subtract(1, "day");
			}
			this.props.loadWeek(mondayDate);
		} else if (this.props.type == "month") {
			var startDate = moment(date).startOf("month");
			this.props.loadMonth(startDate);
		}
	}

	jumpToday() {
		this.jumpToDate(moment());
	}

	change(date) {
		this.jumpToDate(date);
	}

	switchType(type) {
		this.props.switchType(type);
	}

	render(props, state) {
		return <div class="dateHeader">
			<span class="dateHeaderInfo">
				{props.type == "month" && <span class="dateHeaderInfoText">Month of {props.start.format("MMMM YYYY")}</span>}
				{props.type == "week" && <span class="dateHeaderInfoText">Week of</span>}
				{props.type == "week" && <DatePicker format="MMMM D, YYYY" change={this.change.bind(this)} value={props.start} />}
				{props.loadingEvents && <span class="dateHeaderLoading"><LoadingIndicator type="inline" /> Loading...</span>}
			</span>
			<div class="dateHeaderControls">
				{props.showTypeSwitcher && 
					(
						(props.type == "month" && <button class="btn btn-default dateHeaderControlsToggleType" onClick={this.switchType.bind(this, "week")}>Week</button>) ||
						(props.type == "week" && <button class="btn btn-default dateHeaderControlsToggleType" onClick={this.switchType.bind(this, "month")}>Month</button>)
					)
				}
				<button class="btn btn-default dateHeaderControlsRefresh" onClick={this.jumpBlock.bind(this, 0)}><i class="fa fa-refresh"></i></button>
				<button class="btn btn-default" onClick={this.jumpBlock.bind(this, -1)}><i class="fa fa-chevron-left"></i></button>
				<button class="btn btn-default" onClick={this.jumpToday.bind(this)}>Today</button>
				<button class="btn btn-default" onClick={this.jumpBlock.bind(this, 1)}><i class="fa fa-chevron-right"></i></button>
			</div>
		</div>;
	}
};