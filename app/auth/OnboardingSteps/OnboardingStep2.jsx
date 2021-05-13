
import { h } from "preact";

import ClassName from "ui/ClassName.jsx";

export default function OnboardingStep2(props) {
	return <div class="modal-body onboardingStep2">
		<p>Homework can be organized into <em>classes</em>. By default, we add a few classes to MyHomeworkSpace, but you can always add, remove, or change them.</p>
		<ul>
			{props.classes.map((classObj, i) => <li key={i}><ClassName classObject={classObj} /></li>)}
		</ul>
		<p>You can update or change these classes by clicking the <button class="btn btn-default btn-sm"><i class="fa fa-fw fa-chevron-circle-down"></i></button> button at
		the top left-hand side of the screen, then clicking <button class="btn btn-default btn-sm"><i class="fa fa-fw fa-graduation-cap"></i> Classes</button></p>
		<p>Each class is assigned a color, used for organization.</p>
	</div >;
}