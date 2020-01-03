import "ui/nav/TopBarDropdown.styl";

import { h, Component } from "preact";

import Picker from "ui/Picker.jsx";

export default class TopBarDropdown extends Component {
	setOpen(open) {
		this.setState({
			open: open
		});
	}

	openPage(page) {
		this.props.openPage(page);
		this.setOpen(false);
	}

	render(props, state) {
		var that = this;

		var tabs = {};
		tabs["classes"] = { icon: "graduation-cap", name: "Classes" };
		(props.tabs || []).forEach(function(tab) {
			tabs[tab.slug] = { icon: tab.icon, name: tab.label };
		});
		tabs["settings"] = { icon: "cogs", name: "Settings" };
		tabs["help"] = { icon: "question-circle", name: "Help" };
		if (props.me.level > 0) {
			tabs["admin"] = { icon: "server", name: "Admin" };
		}

		return <Picker action={<span class="topBarButtonText">
			<i class={`fa fa-fw fa-${state.open ? "chevron-circle-up" : "chevron-circle-down"}`} />
		</span>} containerClass={`topBarButton topBarDropdownContainer ${state.open ? "selected" : "" }`} class="topBarDropdown" open={!!state.open} setOpen={this.setOpen.bind(this)}>
			<div class="topBarDropdownPopup">
				<div class="topBarDropdownMainTabs">
					{Object.keys(props.mainTabs).map(function(tabKey) {
						var tab = props.mainTabs[tabKey];
						return <div class="topBarDropdownOption mainTab" onClick={that.openPage.bind(that, tabKey)}>
							<i class={`fa fa-fw fa-${tab.icon}`} /> {tab.name}
						</div>;
					})}
				</div>
				{Object.keys(tabs).map(function(tabKey) {
					var tab = tabs[tabKey];
					return <div class="topBarDropdownOption" onClick={that.openPage.bind(that, tabKey)}>
						<i class={`fa fa-fw fa-${tab.icon}`} /> {tab.name}
					</div>;
				})}
			</div>
		</Picker>;
	}
};