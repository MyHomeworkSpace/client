import "ui/AddAction.styl";

import { h } from "preact";
import { useEffect, useState, useLayoutEffect, useRef, useCallback } from "preact/hooks";
import Mousetrap from "mousetrap";


import consts from "consts.js";
import { useInput } from "hooks.js";
import quickAdd from "quickAdd.js";

import AddActionCalendarInfo from "ui/AddActionCalendarInfo.jsx";
import AddActionHomeworkInfo from "ui/AddActionHomeworkInfo.jsx";

export default function AddAction(props) {
	const [input, setInput, bindInput] = useInput("");
	const [open, setOpen] = useState(false);

	const inputRef = useRef(null);

	const click = useCallback(() => {
		if (MyHomeworkSpace.Pages.settings.cache.disableQuickAdd && props.page != "calendar") {
			// show the modal
			MHSBridge.default.openModal("homework", {});
		} else {
			// open the textbox
			setOpen(true);
			setInput("");
		}
	}, [props.page, setInput]);

	useEffect(() => {
		Mousetrap.bind(["ctrl+space", "q"], () => {
			click();
			return false;
		});

		return () => {
			Mousetrap.unbind(["ctrl+space", "q"]);
		};
	}, [click]);

	useLayoutEffect(() => {
		if (open && props.page != "calendar") {
			inputRef.current.focus();
		}
	});

	const close = useCallback((e) => {
		if (e) {
			e.stopPropagation();
		}
		setOpen(false);
	}, []);

	const keydown = useCallback((e) => {
		if (e.keyCode == 27) {
			// escape key
			close();
		}

		if (e.keyCode == 13) {
			// enter key
			let info = quickAdd.parseText(input)[0];

			let hwName = "";

			if (info.tag || info.name) {
				hwName = info.tag + " " + info.name;
			}

			MHSBridge.default.openModal("homework", {
				name: hwName,
				due: (info.due ? info.due.format("YYYY-MM-DD") : null),
				classId: (info.class ? info.class.id : -1),
				direct: (e.altKey || e.shiftKey || e.ctrlKey || e.metaKey)
			});
			close();
		}
	}, [input, close]);

	let thingToAdd = (props.page == "calendar" ? consts.EVENT_TYPE_PLAIN : consts.EVENT_TYPE_HOMEWORK);
	return <div class="addAction">
		{!open && <div class="addActionButton" onClick={click}>
			<i class="fa fa-plus-square"></i> Add {thingToAdd == consts.EVENT_TYPE_PLAIN ? "event" : "homework"}
		</div>}
		{thingToAdd == consts.EVENT_TYPE_HOMEWORK && open && <form class="addActionText">
			<div class="addActionClose" onClick={close}><i class="fa fa-times"></i></div>
			<input type="text" autoComplete="nope" class="addActionInput" placeholder="just start typing..." onKeyDown={keydown} ref={inputRef} {...bindInput} />

			{/*
				the following text input serves absolutely no purpose,
				other than to make chrome decide not to autofill the quick add input
				for whatever reason, it think it's smarter than the websites it visits,
				and IGNORES autocomplete settings when they're applied to all inputs in a form
				so, we make a fake input in order to trick it.

				it also ignores the standard autocomplete="off", needing a random string instead.

				tl;dr: google chrome is an awful browser and it makes me sad
				see: https://bugs.chromium.org/p/chromium/issues/detail?id=468153#c164
				see: https://stackoverflow.com/questions/47775041/disable-autofill-in-chrome-63
			*/}
			<input style="display: none" type="text" name="chrome-is-an-awful-browser-please-do-not-use-it" />
		</form>}
		{thingToAdd == consts.EVENT_TYPE_HOMEWORK && open && <AddActionHomeworkInfo text={input} close={close} openModal={props.openModal} />}
		{thingToAdd == consts.EVENT_TYPE_PLAIN && open && <div class="addActionButton" onClick={close}>
			<i class="fa fa-times"></i> Close
		</div>}
		{thingToAdd == consts.EVENT_TYPE_PLAIN && open && <AddActionCalendarInfo text={input} close={close} openModal={props.openModal} />}
	</div>;
};