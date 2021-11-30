import "homework/HomeworkColumn.styl";

import { h, Component } from "preact";

import { edit, markComplete } from "homework.js";

import { MyHomeworkSpaceCtx } from "App.jsx";
import HomeworkItem from "ui/HomeworkItem.jsx";

export default function HomeworkColumn(props) {
	return <MyHomeworkSpaceCtx.Consumer>
		{MyHomeworkSpace => <div class={`homeworkColumn ${props.noColumnClass ? "" : "col-md-3"} ${props.halfHeight ? "halfHeight" : ""} ${props.top ? "top" : ""}`}>
			<div class="homeworkColumnContainer">
				<div class={`homeworkColumnTitle ${props.isOverdue ? "overdue" : ""}`}>
					{props.title}
					{props.onMarkAll && <div class="homeworkColumnMarkColumn" onClick={props.onMarkAll}><i class="fa fa-check-circle-o"></i> mark all as done</div>}
				</div>
				<div class="homeworkList">
					{props.items.map(function(item) {
						if (item.name.toLowerCase().startsWith("none") || item.name.toLowerCase().startsWith("nohw")) {
							return null;
						}
						return <HomeworkItem
							homework={item}
							classes={MyHomeworkSpace.classes}
							isOverdue={!!props.isOverdue}
							hideDue={!!props.hideDue}
							edit={function(id) {
								edit(id);
							}}
							setComplete={function(id, complete) {
								markComplete(id, (complete ? "1" : "0"));
							}}
						/>;
					})}
				</div>
			</div>
		</div>}
	</MyHomeworkSpaceCtx.Consumer>;
};