import { h, Component } from "preact";

class Collapse extends Component {
	render(props, state) {
		return (
			<div class="panel panel-default">
				<div class="panel-heading" role="tab" id="collapseHeading">
					<h4 class="panel-title"><a href="#collapse" class="" role="button" data-toggle="collapse" aria-expanded="true" aria-controls="collapse"> {props.title} </a> </h4>
				</div>
				<div class="panel-collapse collapse" role="tabpanel" id="collapse" aria-labelledby="collapseHeading" aria-expanded="false" style="">
					<div class="panel-body">
						{ props.children }
					</div>
				</div>
			</div>);
	}
}

export default Collapse; 