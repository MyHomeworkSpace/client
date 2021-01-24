import "admin/panes/announcements/AnnouncementsPane.styl";

import { h, Component } from "preact";

import api from "api.js";

import LoadingIndicator from "ui/LoadingIndicator.jsx";
import linkState from "linkstate";
import DatePicker from "ui/DatePicker.jsx";
import Announcment from "admin/panes/announcements/Announcement.jsx";

import moment from "moment";

export default class AnnouncementsPane extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			users: null,
			content: "",
			expiry: moment().add(1, "day"),
			confirmState: false,
			confirmPhrase: "",
		};
	}

	componentDidMount() {
		this.load();
	}

	load() {
		this.setState({
			loading: true,
			users: null,
		}, () => {
			api.get("notifications/get", {}, (data) => {
				this.setState({
					notifications: data.notifications,
					loading: false
				});
			});
		});
	}

	post() {
		api.post("notifications/add", { expiry: this.state.expiry.format("YYYY-MM-DD"), content: this.state.content }, () => {
			this.setState({
				error: "",
				content: "",
				expiry: moment().add(1, "day"),
				confirmState: false,
				confirmPhrase: "",
			});
			this.load();
		});
	}

	continueToConfirmState() {
		if (this.state.expiry.isSameOrBefore(moment())) {
			this.setState({
				error: "Announcement will never show, it expires today!"
			});
			return;
		}

		if (this.state.content == "") {
			this.setState({
				error: "Announcement is blank!"
			});
			return;

		}
		this.setState({ confirmState: true });
	}

	render(props, state) {
		if (state.loading) {
			return <div>
				<LoadingIndicator />
			</div>;
		}

		var confirmPhrase = "post my announcement";

		return <div class="AnnouncementsPane">
			<div class="row">
				<div class="col-md-6">
					<h3>Post announcement</h3>
					<div class="alert alert-warning">
						<strong>Be careful!</strong> Don't post too many announcements&mdash;not only do they annoy users, but you can get your announcement permissions revoked!
					</div>

					{state.error && <div class="alert alert-danger">
						{state.error}
					</div>}

					<div class="form-group">
						<label>Content</label>
						<textarea class="form-control" disabled={state.confirmState} placeholder="An important message!" value={state.content} onChange={linkState(this, "content")} />
						<p class="help-block">Keep it short and sweet.</p>
					</div>
					<div class="form-group">
						<label>Expiry</label>
						{state.confirmState ?
							<input class="form-control" value={state.expiry.format("ddd, MMMM Do, YYYY")} type="text" disabled /> :
							<DatePicker value={state.expiry} change={(d) => this.setState({ expiry: d })} />
						}
						<p class="help-block">This date is <strong>exclusive</strong>, and in UTC.</p>
					</div>
					{state.confirmState ?
						<div class="buttonsSpaced">
							<p>Proofread your announcement above, then, when you're sure you're ready to post it, type <strong class="noCopy">{confirmPhrase}</strong> in the box below.</p>
							<div class="form-group">
								<input type="text" class="form-control" placeholder={confirmPhrase} onKeyUp={linkState(this, "confirmPhrase")} />
							</div>
							<button class="btn btn-default" onClick={() => this.setState({ confirmState: false })}>Cancel</button>
							<button class="btn btn-danger" disabled={confirmPhrase.toLowerCase() != state.confirmPhrase.toLowerCase()} onClick={this.post.bind(this)}>Post announcement</button>
						</div>
						:
						<button class="btn btn-default" onClick={this.continueToConfirmState.bind(this)}>Submit</button>
					}
				</div>
				<div class="col-md-6">
					<h3>Manage announcements</h3>
					{state.notifications.map((announcement, i) => <Announcment announcement={announcement} key={i} load={this.load.bind(this)} />)}
				</div>
			</div>
		</div >;
	}
};