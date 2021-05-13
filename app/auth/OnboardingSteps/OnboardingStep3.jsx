
import { h } from "preact";
import { useState, useEffect } from "preact/hooks";

import ClassName from "ui/ClassName.jsx";
import EnrollModal from "schools/EnrollModal.jsx";

import api from "api.js";

export default function OnboardingStep3(props) {
	const [showEnrollModal, setShowEnrollModal] = useState(false);
	const [isLoading, setLoading] = useState(true);
	const [schoolData, setSchoolData] = useState(null);

	useEffect(() => {
		api.get("schools/lookup", {
			email: props.me.email,
		}, (resp) => {
			setSchoolData(resp);
			setLoading(false);
		});
	}, [props.me.email]);

	// TODO: There's got to be a better way of doing this with auth/context (like we used to),
	// then firing another request; but that requires accessing the context object from the 
	// modal, which we currently can't do.

	let subProps = props;
	Object.assign(subProps, {
		openModal: (modal) => {
			if (modal == "") {
				setShowEnrollModal(false);
			} else {
				props.openModal(modal);
			}
		}
	});

	Object.assign(subProps.modalState, { email: props.me.email });

	console.log("Hello")

	return <div class="modal-body onboardingStep2">
		<button onClick={() => setShowEnrollModal(!showEnrollModal)}>Toggle enroll modal</button>

		<pre><code>{JSON.stringify(schoolData, null, "\t")}</code></pre>


		{isLoading ?
			<p>Loading...</p>
			: <div>
				{schoolData.status == "ok" &
					<div>
						<p>We've detected that the email that you used to sign up (<strong>{props.me.email}</strong>) is a school email, and
					MyHomeworkSpace can automatically import your schedule.</p>
					</div>}
			</div>}

		{showEnrollModal && <EnrollModal {...subProps}
			closeModal={() => setShowEnrollModal(false)} />}
	</div >;
}