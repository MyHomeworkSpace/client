import "planner/PlannerClassRow.styl";

import { h, Component } from "preact";

import moment from "moment";

import PlannerHomeworkItem from "planner/PlannerHomeworkItem.jsx";

import ClassName from "ui/ClassName.jsx";

export default class PlannerClassRow extends Component {
	addHomework(formattedDay) {
		this.props.openModal("homework", {
			due: formattedDay,
			classId: this.props.classObject.id
		});
	}

	render(props, state) {
		var that = this;

		return <div class="plannerClassRow">
			<div class="plannerClassInfo plannerRowItem">
				<ClassName classObject={props.classObject} />
			</div>
			{[ 0, 1, 2, 3, 4, 5, 6 ].map(function(dayIndex) {
				var day = moment(props.currentWeek).add(dayIndex, "days");
				var formattedDay = day.format("YYYY-MM-DD");
				var homework = (props.classHomework[props.classObject.id] || []).filter(function(homeworkItem) {
					return (formattedDay == homeworkItem.due);
				});
				var allDone = homework.reduce(function(allDone, homework) {
					if (!allDone) { return false; }
					return (homework.complete == 1);
				}, true);
				return <div class={`plannerRowItem ${MyHomeworkSpace.Pages.settings.cache.darkenDoneBoxes && allDone ? "plannerRowItemDone" :""}`}>
					{homework.map(function(homeworkItem) {
						return <PlannerHomeworkItem
							homeworkItem={homeworkItem}
							setDone={props.setDone}
							openModal={props.openModal}
						/>;
					})}
					<div class="plannerRowItemAdd">
						<button class="btn btn-default btn-xs" onClick={that.addHomework.bind(that, formattedDay)}><i class="fa fa-plus" /> add</button>
					</div>
				</div>;
			})}
		</div>;
	}
};