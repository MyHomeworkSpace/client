var baseURL = window.location.protocol + "//api-v2." + window.location.hostname.replace("app.", "") + "/";
var csrfToken = "";

if (window.location.hostname.indexOf("staging2") > -1) {
	baseURL = "https://api-v2-staging2.myhomework.space/";
}

var buildParamStr = function(data, method) {
	if (!data) {
		return "";
	}

	var paramStr = "";

	var first = true;
	for (var key in data) {
		var value = data[key];
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

var buildURL = function(path, method, data) {
	var paramStr = buildParamStr(data, method);

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

var rawRequest = function(path, method, data, callback) {
	var paramStr = buildParamStr(data, method);
	var request = new XMLHttpRequest();

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

var jsonRequest = function(path, method, data, callback) {
	var request = new XMLHttpRequest();

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
	request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
	request.send(data);
};

export default {
	get: function(path, data, callback) {
		return rawRequest(path, "GET", data, callback);
	},
	post: function(path, data, callback) {
		return rawRequest(path, "POST", data, callback);
	},
	// Used only for _special_ requests
	postJSON: function(path, data, callback) {
		return jsonRequest(path, "POST", data, callback);
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