import { h, Fragment } from "preact";
import { useState } from "preact/hooks";

import { uint8ToBase64 } from "base64.js";
import api from "api.js";
import errors from "errors.js";

import Modal from "ui/Modal.jsx";
import SecurityKeyPrompt from "auth/SecurityKeyPrompt.jsx";
import LoadingIndicator from "ui/LoadingIndicator.jsx";



function bufferDecode(value) {
	return Uint8Array.from(atob(value), c => c.charCodeAt(0));
}

function bufferEncode(value) {
	return uint8ToBase64(value)
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=/g, "");
}



const Stage0 = () => <>	<p>Security keys enable you to use a physical device for two factor authentication, rather than a software generated code.</p>
	<p>MyHomeworkSpace currently allows you to add a security key that supports the <strong>FIDO2</strong> (WebAuthn) standard. This includes YubiKeys, Google Titan security keys, and others.</p>
</>;

const Stage2 = () => <>
	<p>Your security key has been added successfully.</p>
</>;

export default function WebAuthnModal(props) {
	const [err, setErr] = useState("");
	const [loading, setLoading] = useState(false);
	const [stage, setStage] = useState(0);
	const [publicKeyData, setPublicKeyData] = useState(null);

	const cancel = stage == 0 ? () => props.openModal("") : () => setStage(stage - 1);

	const cont = () => {
		if (stage == 0) {
			setLoading(true);
			api.post("auth/2fa/beginWebAuthn", {}, (data) => {
				setPublicKeyData(data.publicKey);
				setLoading(false);
				setStage(1);
				data.publicKey.challenge = bufferDecode(data.publicKey.challenge);
				data.publicKey.user.id = bufferDecode(data.publicKey.user.id);
				if (data.publicKey.excludeCredentials) {
					for (var i = 0; i < data.publicKey.excludeCredentials.length; i++) {
						data.publicKey.excludeCredentials[i].id = bufferDecode(data.publicKey.excludeCredentials[i].id);
					}
				}

				navigator.credentials.create({
					publicKey: data.publicKey
				}).then((credential) => {
					let attestationObject = new Uint8Array(credential.response.attestationObject);
					let clientDataJSON = new Uint8Array(credential.response.clientDataJSON);
					let rawId = new Uint8Array(credential.rawId);
					const reqData = {
						id: credential.id,
						rawId: bufferEncode(rawId),
						type: credential.type,
						response: {
							attestationObject: bufferEncode(attestationObject),
							clientDataJSON: bufferEncode(clientDataJSON),
						},
					};

					api.postJSON("auth/2fa/completeWebAuthn", JSON.stringify(reqData), (resp) => {
						if (resp.status == "ok") {
							setStage(2);
						} else {
							setErr(errors.getFriendlyString(resp.error));
							setStage(1);
						}
					});
				}).catch((err) => {
					setStage(0);
					setErr(err.toString());
				});

			});
		}

		if (stage == 2) {
			window.location.reload();
		}
	};

	return <Modal title="Add a security key" openModal={props.openModal} noClose class="webAuthnModal">
		<div class="modal-body">
			{err && <div class="alert alert-danger">{err}</div>}
			{loading && <><LoadingIndicator type="inline" /> Loading, please wait...</>}
			{!loading && (() => {
				switch (stage) {
					case 0: return <Stage0 />;
					case 1: return <SecurityKeyPrompt />;
					case 2: return <Stage2 />;
				}
			})()}
		</div>
		<div class="modal-footer">
			{stage != 2 && <button disabled={loading} type="button" class="btn btn-default" onClick={cancel}>{stage == 0 ? "Cancel" : "Back"}</button>}
			{stage != 1 && <button disabled={loading} type="button" class="btn btn-primary" onClick={cont}>{stage == 2 ? "Done" : "Continue"}</button>}
		</div>
	</Modal>;
};