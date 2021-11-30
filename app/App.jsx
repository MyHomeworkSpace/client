import { h, Fragment, createContext } from "preact";
import Router from "preact-router";
import { useState, useEffect } from "preact/hooks";

import TopBar from "ui/nav/TopBar.jsx";
import api from "api.js";
import prefixesUtil from "prefixes.js";
import quickAdd from "quickAdd.js";

import CalendarPage from "calendar/CalendarPage.jsx";
import ClassesPage from "classes/ClassesPage.jsx";
import HelpPage from "help/HelpPage.jsx";
import HomeworkPage from "homework/HomeworkPage.jsx";
import AdminPage from "admin/AdminPage.jsx";
import PlannerPage from "planner/PlannerPage.jsx";
import SettingsPage from "settings/SettingsPage.jsx";
import Redirect from "ui/Redirect.jsx";

import "App.styl";

export const MyHomeworkSpaceCtx = createContext(null);

export default function App() {
	const [needsNewContext, setNeedsNewContext] = useState(true);
	const [apiInitted, setApiInitted] = useState(false);
	const [classes, setClasses] = useState([]);
	const [prefixes, setPrefixes] = useState([]);
	const [me, setMe] = useState(null);
	const [prefs, setPrefs] = useState(null);

	//TODO: figure out
	const [tabs, setTabs] = useState(null);
	const [page, setPage] = useState(null);

	useEffect(() => {
		if (needsNewContext) {
			const getContext = () => api.get("auth/context", {}, function(context) {
				//TODO: remove prefixesUtil to make preacty
				prefixesUtil.initWithContext(context);

				setClasses(context.classes);
				setPrefixes(prefixesUtil.list);
				setPrefs(context.prefs);
				setMe(context.user);
				setTabs(context.tabs);

				quickAdd.init(context.classes);

				setNeedsNewContext(false);
			});

			if (!apiInitted) {
				api.init(getContext);
			} else {
				getContext();
			}
		}
	}, [needsNewContext, apiInitted]);

	const failwith = (thing) => {
		// eslint-disable-next-line no-console
		console.error(thing);
		alert(thing);
	};

	const openPage = (newPage) => failwith("TODO");

	if (needsNewContext) {
		return <></>;
	}

	const routeProps = {
		params: null,
		classes: classes,
		handleLoginComplete: () => failwith("TODO"), //TODO: implement
		me: me,
		openModal: () => failwith("TODO"),
		refreshContext: () => setNeedsNewContext(true),
		prefs: prefs
	};

	return <MyHomeworkSpaceCtx.Provider
		value={{
			prefs: prefs,
			classes: classes,
		}}
	>
		<div class="topBar">
			<TopBar
				me={me}
				tabs={tabs}
				page={page}
				openPage={openPage}
				inverted={false} //TODO: isDimBackground()
				currentBackground={0} //TODO: currentBackground()
				daltonTabBackgroundDetails={null} //TODO: daltonTabBackgroundDetails()
			/>
		</div>
		<Router>
			<CalendarPage path="/calendar" {...routeProps} />
			<HelpPage path="/help" {...routeProps} />
			<HomeworkPage path="/dashboard" {...routeProps} />
			<ClassesPage path="/classes" {...routeProps} />
			<AdminPage path="/admin" {...routeProps} />
			<PlannerPage path="/planner" {...routeProps} />
			<SettingsPage path="/settings" {...routeProps} />
			<Redirect default to="/dashboard" />
		</Router>

	</MyHomeworkSpaceCtx.Provider>;
}