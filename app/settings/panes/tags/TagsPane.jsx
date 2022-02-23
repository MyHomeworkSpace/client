import { h, Component } from "preact";

import PrefixList from "settings/panes/tags/PrefixList.jsx";

export default class TagsPane extends Component {
	render(props, state) {
		return <div class="homeworkPane">
			<h4>Tags</h4>
			<p class="homeworkSettingsDescription">You can add custom tags to be used on MyHomeworkSpace.</p>
			<PrefixList refreshContext={props.refreshContext} />
		</div>;
	}
};