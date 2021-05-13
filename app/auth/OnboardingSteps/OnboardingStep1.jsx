
import { h } from "preact";

import HomeworkName from "ui/HomeworkName.jsx";

export default function OnboardingStep1(props) {
	return <div class="modal-body onboardingStep1">
		<p>Every assignment in MyHomeworkSpace is a homework. You can add homework with the
			<button className="btn btn-default btn-sm"><i className="fa fa-plus-square"></i> Add Homework</button> button,
			up at the top of the screen.</p>
		<p>Type homework into the "Add homework" field the same way you would tell another human about homework that you have,
		for example, MyHomeworkSpace will understand what you mean if you write "read poem for english tomorrow," or even
			"take test on molecules in Science on a week from Tuesday"</p>
		<p>Each homework starts with the type, used for color coding. For example, you might have a homework assignment
			"<HomeworkName name="Read chapter 4" />," or "<HomeworkName name="Quiz on kinematics" />."</p>
	</div>;
}