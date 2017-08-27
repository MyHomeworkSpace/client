import "ui/HomeworkPicker.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import $ from "jquery";
import moment from "moment";

import HomeworkName from "ui/HomeworkName.jsx";
import HomeworkPickerPopup from "ui/HomeworkPickerPopup.jsx";

class HomeworkPicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			bodyClick: this.onBodyClick.bind(this)
		};
	}

	onBodyClick(e) {
		if ($(e.target).closest(".homeworkPickerPopup").length == 0) {
			this.toggle();
		}
	}

	toggle(e) {
		if (e) {
			e.stopPropagation();
		}
		this.setState({
			open: !this.state.open
		}, function() {
			if (this.state.open) {
				$("body").bind("click", this.state.bodyClick);
			} else {
				$("body").unbind("click", this.state.bodyClick);
			}
		});
	}

	selectHW(hw) {
		this.props.change(hw);
		this.toggle();
	}

	render(props, state) {
		return <div class="homeworkPickerContainer">
			<div class="homeworkPicker" onClick={!state.open && this.toggle.bind(this)}>
				<div class="homeworkPickerOutput">
					{!props.value && <span class="homeworkPickerOutputNoSelect">Select homework...</span>}
					{props.value && <HomeworkName name={props.value.name} />}
				</div>
				<div class="homeworkPickerAction"><i class={state.open ? "fa fa-chevron-circle-up" : "fa fa-chevron-circle-down"} /></div>
				<div class="homeworkPickerClear"></div>
			</div>
			{state.open && <HomeworkPickerPopup hw={props.value} selectHW={this.selectHW.bind(this)} />}
		</div>;
	}
}

export default HomeworkPicker;