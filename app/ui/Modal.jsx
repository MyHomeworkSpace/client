import "ui/Modal.styl";

import { h, Component } from "preact";
import { useState, useEffect } from "preact/hooks";

export default function Modal(props) {
	const [marginLeft, setMarginLeft] = useState(0);
	const [marginTop, setMarginTop] = useState(0);
	const [isDragging, setIsDragging] = useState(false);

	useEffect(() => {
		const move = (x, y) => {
			setMarginLeft(marginLeft + x);
			setMarginTop(marginTop + y);
		};

		const mouse = ({ movementX, movementY, buttons }) => {
			if (isDragging) {
				move(movementX, movementY);
			}

			if (buttons === 0) {
				setIsDragging(false);
			}
		};

		window.addEventListener("mousemove", mouse);

		return () => {
			window.removeEventListener("mousemove", mouse);
		};
	});

	return <div
		class={`modal modal-preact ${!props.noClose && "noClose"} ${props.class ? props.class : ""}`}
		style="display: block; padding-left: 0px;">
		<div class="modal-dialog" role="document">
			<div class="modal-drag-wrapper" style={`margin: ${marginTop}px ${-marginLeft}px ${-marginTop}px ${marginLeft}px;`}>
				<div class="modal-content modal-animation">
					<div class="modal-header"
						onMouseDown={() => setIsDragging(true)}
						onMouseUp={() => setIsDragging(false)}>
						{!props.noClose && <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={() => props.openModal("")}><span aria-hidden="true">&times;</span></button>}
						<h4 class="modal-title">{props.title}</h4>
					</div>
					{props.children}
				</div>
			</div>
		</div>
	</div>;
}
