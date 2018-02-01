import "homework/HomeworkColumn.styl";

import { h, Component } from "preact";

import HomeworkItem from "homework/HomeworkItem.jsx";

class HomeworkColumn extends Component {
	render(props, state) {
		return <div class="homeworkColumn col-md-3">
			<h2 class={props.isOverdue ? "overdue" : ""}>
				{props.title}
				{props.onMarkAll && <div class="homeworkColumnMarkColumn" onClick={props.onMarkAll}><i class="fa fa-check-circle-o"></i> mark all as done</div>}
			</h2>
			<div class="homeworkList">
				{props.items.map(function(item) {
					if (item.name.toLowerCase().startsWith("none") || item.name.toLowerCase().startsWith("nohw")) {
						return null;
					}
					return <HomeworkItem
						homework={item}
						classes={MyHomeworkSpace.Classes.list}
						isMondayColumn={props.title == "Monday"}
						edit={function(id) {
							MyHomeworkSpace.Pages.homework.edit(id);
						}}
						setComplete={function(id, complete) {
							MyHomeworkSpace.Pages.homework.markComplete(id, (complete ? "1" : "0"));
						}}
					/>;
				})}
			</div>
		</div>;
	}
}

export default HomeworkColumn;