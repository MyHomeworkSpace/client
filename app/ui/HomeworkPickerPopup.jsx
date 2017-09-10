import "ui/HomeworkPickerPopup.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";

import HomeworkName from "ui/HomeworkName.jsx";
import LoadingIndicator from "ui/LoadingIndicator.jsx";

class HomeworkPickerPopup extends Component {
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
		var that = this;
		api.get("homework/getPickerSuggestions", {}, function(xhr) {
			that.setState({
				suggestions: xhr.responseJSON.homework,
				loading: false
			});
		});
	}

	keyup(e) {
		var that = this;
		if (e.keyCode == 13) {
			this.setState({
				lastQuery: this.state.query,
				loading: true
			}, function() {
				api.get("homework/search", {
					q: this.state.query
				}, function(xhr) {
					that.setState({
						results: xhr.responseJSON.homework,
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
		var noResults = "noResults";
		var that = this;
		var results;

		if (state.loading) {
			results = <p><LoadingIndicator type="inline" /> Loading, please wait...</p>;
		} else if (state.lastQuery == "") {
			results = state.suggestions.map(function(result) {
				return <div class="homeworkPickerPopupResult" onClick={that.resultClick.bind(that, result)}>
					<HomeworkName name={result.name} />
				</div>;
			});
		} else if (state.results.length == 0) {
			results = <p>No results found.</p>;
		} else {
			noResults = "";
			results = state.results.map(function(result) {
				return <div class="homeworkPickerPopupResult" onClick={that.resultClick.bind(that, result)}>
					<HomeworkName name={result.name} />
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
}

export default HomeworkPickerPopup;