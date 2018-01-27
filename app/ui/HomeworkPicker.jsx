import "ui/HomeworkPicker.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import moment from "moment";

import HomeworkName from "ui/HomeworkName.jsx";
import HomeworkPickerPopup from "ui/HomeworkPickerPopup.jsx";
import Picker from "ui/Picker.jsx";

class HomeworkPicker extends Component {
	selectHW(hw) {
		this.props.change(hw);
		this.toggle();
	}

	setOpen(open) {
		this.setState({
			open: open
		});
	}

	render(props, state) {
		var display;
		if (props.value) {
			display = <HomeworkName name={props.value.name} />;
		} else {
			display = <span class="homeworkPickerOutputNoSelect">Select homework...</span>;
		}

		return <Picker display={display} class="homeworkPicker" open={state.open} setOpen={this.setOpen.bind(this)}>
			<HomeworkPickerPopup hw={props.value} selectHW={this.selectHW.bind(this)} />
		</Picker>;
	}
}

export default HomeworkPicker;