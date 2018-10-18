import "classes/ClassList.styl";

import { h, Component } from "preact";

import ClassItem from "classes/ClassItem.jsx";

class ClassList extends Component {
	render(props, state) {
		return <div class="classList">
			<div class="classItems">
				{props.classes.map(function(classDetails) {
					return <ClassItem classItem={classDetails} onClick={props.onClick}/>
				})}
			</div>
		</div>
	}
}

export default ClassList;