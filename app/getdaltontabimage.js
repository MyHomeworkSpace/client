export default function getDaltonTabImage(callback) {
	var request = new XMLHttpRequest();
	request.open("GET", "https://daltontabservices.myhomework.space/v1/getImage", true);
	request.onload = function() {
		callback(JSON.parse(request.responseText), request);
	};
	request.onerror = function() {
		callback({
			status: "error",
			error: "disconnected"
		}, request);
	};
	request.send();
}

export function pingBeacon() {
	getDaltonTabImage((imageData) => {
		var request = new XMLHttpRequest();
		request.open("GET", imageData.beaconURL, true);
		request.send();
	});
}