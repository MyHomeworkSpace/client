import "classes/ClassesPage.styl";

import { h, Component } from "preact";

import ClassDetails from "classes/ClassDetails.jsx";
import ClassItem from "classes/ClassItem.jsx";

export default class ClassesPage extends Component {
	addClass() {
		this.props.openModal("class", {});
	}

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
			<div class="classesPageList">
				<h2>
					Classes
					<div class="btn btn-primary btn-sm" onClick={this.addClass.bind(this)}><i class="fa fa-plus"></i> add</div>
				</h2>

				<div class="classList">
					{props.classes.map((classObject) => {
						return <ClassItem classObject={classObject} selected={classObject == selectedClass} onClick={this.selectClass.bind(this, classObject)}/>;
					})}
				</div>
			</div>
			<div class="classesPageDetails">
				{selectedClass ? <ClassDetails classObject={selectedClass} openModal={props.openModal} /> : <p class="lead noClassSelected">Select a class for details</p>}
			</div>
		</div>;
	}
};