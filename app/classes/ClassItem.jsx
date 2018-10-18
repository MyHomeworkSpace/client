import "classes/ClassItem.styl";

import { h, Component } from "preact";

class ClassItem extends Component {
	handleClick() {
		this.props.onClick(this.props.classItem);
	}

	render(props, state) {
		return <div class="classItem" style={`border-left-color: #${props.classItem.color}`} onClick={this.handleClick.bind(this)}>
			<p class="className">{props.classItem.name}</p>
		</div>;
	}
}

export default ClassItem;