import "ui/nav/Sidebar.styl";

import { h, Component } from "preact";

import SidebarLink from "ui/nav/SidebarLink.jsx";

class Sidebar extends Component {
	render(props, state) {
		return <div class={`sidebar ${props.visible ? "visible" : "hiding"}`}>
			<SidebarLink page="homework" icon="file-o" label="Homework" currentPage={props.page} openPage={props.openPage} />
			<SidebarLink page="planner" icon="book" label="Planner" currentPage={props.page} openPage={props.openPage} />
			<SidebarLink page="calendar" icon="calendar" label="Calendar" currentPage={props.page} openPage={props.openPage} />
		
			<SidebarLink tiny page="classes" icon="graduation-cap" label="Classes" currentPage={props.page} openPage={props.openPage} />
			<SidebarLink tiny page="settings" icon="cogs" label="Settings" currentPage={props.page} openPage={props.openPage} />
			<SidebarLink tiny page="help" icon="question-circle" label="Help" currentPage={props.page} openPage={props.openPage} />
		</div>;
	}
}

export default Sidebar;