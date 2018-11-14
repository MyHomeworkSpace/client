import "admin/AdminPage.styl"

import { h, Component } from 'preact';

import AdminListItem from 'admin/AdminListItem.jsx'

import api from 'api.js';

class AdminPage extends Component {
    constructor() {
        this.state = {
            loading: true
        }
        this.load()
    }

    load() {
        this.setState({
            loading: true,
            users: undefined,
            feedback: undefined,
            notifications: undefined
        })
        api.get("admin/getAllUsers", {}, (users) => {
            this.setState({
                users: users.users
            }, () => {
                this.checkIfDoneLoading();
            })
        })
        api.get("admin/getAllFeedback", {}, (feedback) => {
            this.setState({
                feedback: feedback.feedbacks
            }, () => {
                this.checkIfDoneLoading();
            })
        })
        api.get("notifications/get", {}, (notifications) => {
            this.setState({
                notifications: notifications.notifications
            }, () => {
                this.checkIfDoneLoading();
            })
        })
    }

    checkIfDoneLoading() {
        if (this.state.feedback && this.state.users && this.state.notifications) {
            this.setState({
                loading: false
            })
        }
    }

    newNotification() {
        var content = prompt("Enter notification content")
        var expiry = prompt("Enter notification expiry")
        if(confirm("Look good? Content: " + content + " Expires: " + expiry)){
            api.post("notifications/add", {expiry: expiry, content: content}, (response) => {
                alert(JSON.stringify(response));
                this.load();
            })
        } else {
            alert("Aborted.")
        }
    }

    render(props, state) {
        if (this.state.loading) return <p>Loading... Please wait</p>
        return <div class="adminPage">
            <h2>Administration Tools</h2>
            <div class="row">
                <div class="col-md-4">
                    <h4 class="adminListTitle">Users</h4>
                    {this.state.users.map((user) => {
                        return (
                            <AdminListItem type="user" data={user} load={this.load.bind(this)}/>
                        )
                    })}
                </div>
                <div class="col-md-4">
                    <h4 class="adminListTitle">Feedback</h4>
                    {this.state.feedback.map((feedback) => {
                        return (
                            <AdminListItem type="feedback" data={feedback} load={this.load.bind(this)}/>
                        )
                    })}
                </div>
                <div class="col-md-4">
                    <h4 class="adminListTitle">Notifications</h4>
                    {this.state.notifications.map((notification) => {
                        return (
                            <AdminListItem type="notification" data={notification} load={this.load.bind(this)}/>
                        )
                    })}
                    <button class="btn btn-primary" onClick={this.newNotification}>New Notification</button>
                </div>
            </div>
        </div>;
    }
}

export default AdminPage;