import "settings/panes/account/SchoolList.styl";

import { h, Component } from "preact";

export default class SchoolList extends Component {
	render(props, state) {
		if (props.me.schools.length == 0) {
			return <div class="schoolList none">
				You haven't connected any school accounts to MyHomeworkSpace.
			</div>;
		}

		return <div class="schoolList">
			{props.me.schools.map(function(school) {
				return <div class="schoolItem">
					<div class="schoolName">{school.displayName}</div>
				</div>;
			})}
		</div>;
	}
};