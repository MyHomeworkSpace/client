import { h, Component } from "preact";

import ClassName from "ui/ClassName.jsx";
import ClassPickerItem from "ui/ClassPickerItem.jsx";
import Picker from "ui/Picker.jsx";

export default class ClassPicker extends Component {
	selectClass(classObject) {
		this.setState({
			open: false
		}, function() {
			this.props.change(classObject.id);
		});
	}

	setOpen(open) {
		this.setState({
			open: open
		});
	}

	render(props, state) {
		var that = this;

		var selectedClass;
		var display;

		if (props.value != -1) {
			props.classes.forEach(function(classObject) {
				if (classObject.id == props.value) {
					selectedClass = classObject;
				}
			});
		}

		if (selectedClass) {
			display = <ClassName classObject={selectedClass} />;
		} else {
			display = "No class selected";
		}

		return <Picker display={display} open={state.open} setOpen={this.setOpen.bind(this)}>
			<div class="pickerPopup">
				{props.classes.map(function(classObject) {
					return <ClassPickerItem classObject={classObject} onClick={that.selectClass.bind(that, classObject)} />;
				})}
			</div>
		</Picker>;
	}
};