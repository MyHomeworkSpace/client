import "ui/Modal.styl";

import { h } from "preact";
import { useState, useEffect, useRef } from "preact/hooks";

export default function Modal(props) {
	const [marginLeft, setMarginLeft] = useState(0);
	const [marginTop, setMarginTop] = useState(30);

	const [dragOffsetLeft, setDragOffsetLeft] = useState(0);
	const [dragOffsetTop, setDragOffsetTop] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const modalDragWrapper = useRef(null);

	useEffect(() => {
		const mouse = ({ clientX, clientY, buttons }) => {
			if (isDragging) {
				const modalDragWrapperPosition = modalDragWrapper.current.getBoundingClientRect();

				setMarginLeft(clientX - dragOffsetLeft - (window.innerWidth / 2) + (modalDragWrapperPosition.width / 2));
				setMarginTop(clientY - dragOffsetTop);
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

	const mouseDown = (e) => {
		const modalDragWrapperPosition = modalDragWrapper.current.getBoundingClientRect();

		setIsDragging(true);
		setDragOffsetLeft(e.clientX - modalDragWrapperPosition.left);
		setDragOffsetTop(e.clientY - modalDragWrapperPosition.top);
	};

	const mouseUp = () => {
		setIsDragging(false);
	};

	return <div
		class={`modal modal-preact ${!props.noClose && "noClose"} ${props.class ? props.class : ""}`}
		style="display: block; padding-left: 0px;"
	>
		<div class="modalOverlay" onClick={() => {
			if (props.noClose) {
				return;
			}

			props.openModal("");
		}}></div>
		<div class="modal-dialog" role="document">
			<div
				class="modal-drag-wrapper"
				style={`margin: ${marginTop}px ${-marginLeft}px ${-marginTop}px ${marginLeft}px;`}
				ref={modalDragWrapper}
			>
				<div class="modal-content modal-animation">
					<div class="modal-header"
						onMouseDown={mouseDown}
						onMouseUp={mouseUp}
					>
						{!props.noClose && <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={() => props.openModal("")}><span aria-hidden="true">&times;</span></button>}
						<h4 class="modal-title">{props.title}</h4>
					</div>
					{props.children}
				</div>
			</div>
		</div>
	</div>;
}
