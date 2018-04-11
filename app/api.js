var baseURL = window.location.protocol + "//api-v2." + window.location.hostname + "/";
var token = "";
var workingTimeout;

if (window.location.hostname.indexOf("localtest.me") > -1) {
	baseURL = "http://mhs-api.localtest.me/";
}

var rawRequest = function(path, method, data, callback) {
	$("#workingOverlay").css("opacity", 0);
	$("#workingOverlay").hide();
	if (workingTimeout === undefined) {
		workingTimeout = setTimeout(function() {
			$("#workingOverlay").show();
			$("#workingOverlay").css("opacity", 0.5);
		}, 2000);
	}
	$.ajax({
		crossDomain: true,
		data: data,
		method: method,
		url: baseURL + path,
		xhrFields: {
			withCredentials: true
		},
		complete: function(jqXHR) {
			$("#workingOverlay").css("opacity", 0);
			$("#workingOverlay").hide();
			clearTimeout(workingTimeout);
			workingTimeout = undefined;
			callback(jqXHR.responseJSON, jqXHR);
		}
	});
};

var request = function(path, method, data, callback) {
	return rawRequest(path + "?csrfToken=" + encodeURIComponent(token), method, data, callback);
};

export default {
	get: function(path, data, callback) {
		return request(path, "GET", data, callback);
	},
	post: function(path, data, callback) {
		return request(path, "POST", data, callback);
	},
	init: function(callback) {
		rawRequest("auth/csrf", "GET", {}, function(data) {
			token = data.token;
			callback();
		});
	}
};