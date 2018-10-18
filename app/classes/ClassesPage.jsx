import "classes/ClassesPage.styl";

import { h, Component } from "preact";

import api from "api.js";

import AddClass from "classes/AddClass.jsx";
import ClassDetails from "classes/ClassDetails.jsx";
import ClassList from "classes/ClassList.jsx";

class ClassesPage extends Component {
	constructor() {
		super();
		this.state = {
			loading: true
		};
	}

	componentDidMount() {
		this.load();
	}

	componentWillReceiveProps(nextProps, nextState) {
		this.load();
	}
	
	load() {
		this.setState({
			loading: true
		}, function() {
			var that = this;
			api.get("classes/get", {
				showToday: true
			}, function(data) {
				that.setState({
					loading: false,
					classes: data.classes,
					selectedClass: null
				});
			});
		});
	}

	selectClass(newClass) {
		this.setState({
			selectedClass: newClass
		});
	}
	
	render(props, state) {
		if (state.loading) {
			return <div class="classesPage">
				Loading, please wait...
			</div>;
		}

		return <div class="classesPage">
			<div class="row columns">
				<div class="col-md-3 classesList">
					<h2>Classes</h2>
					<p class="lead">Select a class to view homework and details</p>
					<ClassList classes={state.classes} onClick={this.selectClass.bind(this)}/>
					<AddClass openModal={props.openModal}/>
				</div>
				<div class="col-md-9">
					{state.selectedClass == null ? <p class="lead noClassSelected">Select a class for details</p> : <ClassDetails classObject={state.selectedClass} openModal={props.openModal} />}
				</div>
			</div>
		</div>;
	}
}

export default ClassesPage;