let baseURL = window.location.protocol + "//api-v2." + window.location.hostname.replace("app.", "") + "/";
let csrfToken = "";

if (window.location.hostname.indexOf("staging2") > -1) {
	baseURL = "https://api-v2-staging2.myhomework.space/";
}

let buildParamStr = function(data, method) {
	if (!data) {
		return "";
	}

	let paramStr = "";

	let first = true;
	for (let key in data) {
		let value = data[key];
		if (first) {
			first = false;
		} else {
			paramStr += "&";
		}
		paramStr += key;
		paramStr += "=";
		paramStr += encodeURIComponent(value);
	}

	return paramStr;
};

let buildURL = function(path, method, data) {
	let paramStr = buildParamStr(data, method);

	if (csrfToken) {
		path = path + "?csrfToken=" + encodeURIComponent(csrfToken);
		if (Object.keys(data).length != 0) {
			path += "&";
		}
	} else if (paramStr) {
		path = path + "?";
	}

	return baseURL + path + (method == "GET" ? paramStr : "");
};

let rawRequest = function(path, method, data, callback) {
	let paramStr = buildParamStr(data, method);
	let request = new XMLHttpRequest();

	request.withCredentials = true;
	request.open(method, buildURL(path, method, data), true);
	request.onload = function() {
		callback(JSON.parse(request.responseText), request);
	};
	request.onerror = function() {
		callback({
			status: "error",
			error: "disconnected"
		}, request);
	};
	if (method == "POST") {
		request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	}
	request.send(method == "POST" ? paramStr : undefined);
};

export default {
	get: function(path, data, callback) {
		return rawRequest(path, "GET", data, callback);
	},
	post: function(path, data, callback) {
		return rawRequest(path, "POST", data, callback);
	},
	init: function(callback) {
		rawRequest("auth/csrf", "GET", {}, function(data) {
			csrfToken = data.token;
			callback();
		});
	},
	buildURL: buildURL,
	baseURL: baseURL,
};