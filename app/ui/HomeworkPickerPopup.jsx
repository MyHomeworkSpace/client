import "ui/HomeworkPickerPopup.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";

import ClassName from "ui/ClassName.jsx";
import HomeworkName from "ui/HomeworkName.jsx";
import LoadingIndicator from "ui/LoadingIndicator.jsx";

export default class HomeworkPickerPopup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			query: "",
			lastQuery: "",
			loading: true,
			results: []
		};
	}

	componentDidMount() {
		api.get("homework/getPickerSuggestions", {}, (data) => {
			this.setState({
				suggestions: data.homework,
				loading: false
			});
		});
	}

	keyup(e) {
		if (e.keyCode == 13) {
			this.setState({
				lastQuery: this.state.query,
				loading: true
			}, () => {
				api.get("homework/search", {
					q: this.state.query
				}, (data) => {
					this.setState({
						results: data.homework,
						loading: false
					});
				});
			});
		}
	}

	resultClick(result) {
		this.props.selectHW(result);
	}

	render(props, state) {
		let noResults = "noResults";
		let results;
		let source;

		if (state.loading) {
			results = <p><LoadingIndicator type="inline" /> Loading, please wait...</p>;
		} else if (state.lastQuery == "") {
			source = state.suggestions;
		} else if (state.results.length == 0) {
			results = <p>No results found.</p>;
		} else {
			source = state.results;
			noResults = "";
		}

		if (!results) {
			results = source.map((result) => {
				let classObject;
				for (let classIndex in props.classes) {
					if (props.classes[classIndex].id == result.classId) {
						classObject = props.classes[classIndex];
					}
				}

				return <div class="homeworkPickerPopupResult" onClick={this.resultClick.bind(this, result)}>
					<HomeworkName name={result.name} />
					<div class="homeworkPickerPopupResultClass">
						<ClassName classObject={classObject} />
					</div>
				</div>;
			});
		}

		return <div class="homeworkPickerPopup">
			<input type="text" class="form-control" placeholder="Search for homework..." value={state.query} onInput={linkState(this, "query")} onKeyup={this.keyup.bind(this)} disabled={state.loading} />
			<div class={`homeworkPickerPopupResults ${noResults}`}>
				{state.lastQuery == "" && <div class="homeworkPickerSuggestionTitle">Suggestions</div>}
				{results}
			</div>
		</div>;
	}
};