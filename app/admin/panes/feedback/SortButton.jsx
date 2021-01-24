import { h, Component } from "preact";

export default class SortButton extends Component {
	render(props, state) {
		let active = (props.currentSortType == props.sortType);

		return <button type="button" class={`btn btn-default ${active ? "active" : ""}`} onClick={props.setSortType}>
			<i class={`fa fa-fw ${props.icon}`}></i>{" "}{props.name}
		</button>;
	}
}