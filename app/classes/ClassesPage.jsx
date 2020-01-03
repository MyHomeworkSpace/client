import "classes/ClassesPage.styl";

import { h, Component } from "preact";

import AddClass from "classes/AddClass.jsx";
import ClassDetails from "classes/ClassDetails.jsx";
import ClassList from "classes/ClassList.jsx";

export default class ClassesPage extends Component {
	selectClass(newClass) {
		this.setState({
			selectedClassID: newClass.id
		});
	}
	
	render(props, state) {
		var classes = MyHomeworkSpace.Classes.list;

		var selectedClass;

		if (state.selectedClassID) {
			classes.forEach(function(classObject) {
				if (classObject.id == state.selectedClassID) {
					selectedClass = classObject;
					return false;
				}
			});
		}

		return <div class="classesPage">
			<div class="row columns">
				<div class="col-md-3 classesList">
					<h2>Classes</h2>
					<p class="lead">Select a class to view homework and details</p>
					<ClassList classes={classes} onClick={this.selectClass.bind(this)} />
					<AddClass openModal={props.openModal} />
				</div>
				<div class="col-md-9">
					{selectedClass ? <ClassDetails classObject={selectedClass} openModal={props.openModal} /> : <p class="lead noClassSelected">Select a class for details</p>}
				</div>
			</div>
		</div>;
	}
};