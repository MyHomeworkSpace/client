import "ui/ClassPickerItem.styl";

import { h, Component } from "preact";

import ClassName from "ui/ClassName.jsx";

export default class ClassPickerItem extends Component {
	render(props, state) {
		return <div class="classPickerItem" onClick={props.onClick}>
			<ClassName classObject={props.classObject} />
		</div>;
	}
};