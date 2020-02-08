import "classes/ClassItem.styl";

import { h, Component } from "preact";

import ClassName from "ui/ClassName.jsx";

export default class ClassItem extends Component {
	handleClick() {
		this.props.onClick(this.props.classObject);
	}

	render(props, state) {
		return <div class={`classItem ${props.selected ? "selected" : ""}`} onClick={this.handleClick.bind(this)}>
			<ClassName classObject={props.classObject} />
		</div>;
	}
};