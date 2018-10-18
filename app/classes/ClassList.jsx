import "classes/ClassList.styl";

import { h, Component } from "preact";

import ClassItem from 'classes/ClassItem.jsx'

class ClassList extends Component {
    render(props, state) {
        const that = this;
        return <div class="class-list">
            <div class="class-items">
                {this.props.classes.map(function (classDetails) {
                    return <ClassItem classItem={classDetails} onClick={that.props.onClick}/>
                })}
            </div>
        </div>
    }
}

export default ClassList;