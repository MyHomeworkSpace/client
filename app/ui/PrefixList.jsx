import { h, Component } from "preact";

import HomeworkName from "ui/HomeworkName.jsx";

import prefixes from "prefixes.js";

class PrefixList extends Component {
	render(props, state) {
		var groups = prefixes.list.map(function(group) {
			if (group.words.indexOf("Hex") > -1) {
				// shhhhh
				return;
			}
			var words = group.words.map(function(word) {
				return <HomeworkName name={word} />;
			});
			return <div>
				{words}
			</div>;
		});
		return <div>
			{groups}
		</div>;
	}
}

export default PrefixList;