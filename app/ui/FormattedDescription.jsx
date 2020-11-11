import { h, Component } from "preact";

export default class FormattedDescription extends Component {
	render(props, state) {
		return <div>
			{props.text.split("\n").map((line) => {
				return <div>{line}</div>;
			})}
		</div>;
	}
};