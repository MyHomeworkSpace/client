import "classes/ClassDetails.styl";

import { h, Component } from "preact";

import api from "api.js";
import HomeworkItem from "homework/HomeworkItem.jsx"
import EditClassButton from "classes/EditClassButton.jsx"
import SwapClassButton from "classes/SwapClassButton.jsx"

class ClassDetails extends Component {
    constructor() {
        super();
        this.state = {
            loading: true,
        }
    }

    componentDidMount() {
        this.load()
    }

    componentWillReceiveProps(nextProps, nextState) {
		this.load();
	}

    load() {
        const that = this;
        this.setState({
            loading: true
        }, function () {
            api.get(`homework/getForClass/${this.props.classObject.id}`, null, function (data) {
                that.setState({
                    loading: false,
                    homework: data.homework,
                });
            });
        });
    }

    render(props, state) {
        if (state.loading) {
            return <div class="class">
                <h1>{props.classObject.name}</h1>
                <p class="lead">{this.props.classObject.teacher}</p>
                <div class="btn-group classActions" role="group">
                    <EditClassButton openModal={props.openModal} classItem={props.classObject}/> 
                    <SwapClassButton openModal={props.openModal} classItem={props.classObject}/>
                </div>
                <p>Homework Loading...</p>
            </div>;
        }

        return <div class="class">
            <h1>{props.classObject.name}</h1>
            <p class="lead">{props.classObject.teacher}</p>
            <div class="btn-group classActions" role="group">
                <EditClassButton openModal={props.openModal} classItem={props.classObject}/> 
                <SwapClassButton openModal={props.openModal} classItem={props.classObject}/>
            </div>
            {state.homework.map(function(item) {
                if (item.name.toLowerCase().startsWith("none") || item.name.toLowerCase().startsWith("nohw")) {
                    return null;
                } else if ((moment(item.due).unix() < moment().unix()) && item.complete != 0) {
                    return null;
                }
                return <HomeworkItem
                    homework={item}
                    classes={MyHomeworkSpace.Classes.list}
                    isOverdue={(moment(item.due).unix() < moment().unix())}
                    edit={function(id) {
                        MyHomeworkSpace.Pages.homework.edit(id);
                    }}
                    setComplete={function(id, complete) {
                        MyHomeworkSpace.Pages.homework.markComplete(id, (complete ? "1" : "0"));
                    }}
                />;
            })}
        </div>;
    }
}

export default ClassDetails;