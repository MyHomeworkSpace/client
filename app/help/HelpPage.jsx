import { h, Component } from "preact";

import HomeworkName from "ui/HomeworkName.jsx";
import PrefixList from "ui/PrefixList.jsx";

class HelpPage extends Component {
	render(props, state) {
		return <div>
			<h2>Help</h2>

			<h3>Adding homework</h3>
			<p>You can add homework with the Add Homework button above. If you have Quick Add enabled, just type what you'd like to add. These are all examples of valid inputs:</p>
			<ul>
				<li>read poem for English for tomorrow</li>
				<li>take test on molecules in Science on next Tuesday</li>
				<li>for next Friday, write an essay about the revolution in History class</li>
			</ul>
			<p>Quick Add can be disabled from the "Quick Add" tab on the Settings page.</p>

			<h3>Color Coding Tags</h3>
			<p>A tag is the first word of an assignment. Certain tags are color-coded to match assignment types. For example, the <HomeworkName name="Read" /> tag turns blue when it is the first word of an assgnment title. A list of all tags and their colors is provided below.</p>
			<PrefixList />

			<h3>Changing a class</h3>
			<p>To add, modify, or move a class, select the Classes tab on the left. Then, select the "Add" button, the pencil button next to a class, or the arrows next to a class respectively.</p>

			<h3>Further questions? Have an idea?</h3>
			<p>Feel free to contact us with any questions, comments, or ideas you have&mdash;just use the feedback button at the top-right, next to your name.</p>
		</div>;
	}
}

export default HelpPage;