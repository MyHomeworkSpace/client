MyHomeworkSpace.Pages.settings = {
	cache: {},
	hackyBackgroundColorTimeout: undefined,
	init: function() {

	},
	onLogin: function() {
		MyHomeworkSpace.API.get("prefs/get/background", {}, function(xhr) {
			if (xhr.responseJSON.status != "error") {
				var bgVal = xhr.responseJSON.pref.value;
				MyHomeworkSpace.Pages.settings.cache["background"] = bgVal;
				MyHomeworkSpace.Pages.settings.setBackground(bgVal);
				if (bgVal.substr(0, 3) == "clr") {
					$("#backgroundColor").val(bgVal.split(":")[1]);
				}
			}
		});

		$(".settings_checkbox").each(function() {
			var $that = $(this);
			MyHomeworkSpace.API.get("prefs/get/" + $(this).attr("data-pref"), {}, function(xhr) {
				if (xhr.responseJSON.status != "error") {
					var newVal = (xhr.responseJSON.pref.value == "true");
					MyHomeworkSpace.Pages.settings.cache[xhr.responseJSON.pref.key] = newVal;
					if ($that.attr("data-pref-inverted") && $that.attr("data-pref-inverted") == "true") {
						newVal = !newVal;
					}
					$that.prop("checked", newVal);
				}
			});
		});
		$(".settings_checkbox").change(function() {
			var newVal = $(this).prop("checked");
			if ($(this).attr("data-pref-inverted") && $(this).attr("data-pref-inverted") == "true") {
				newVal = !newVal;
			}
			MyHomeworkSpace.Pages.settings.cache[$(this).attr("data-pref")] = newVal;
			MyHomeworkSpace.API.post("prefs/set", {
				key: $(this).attr("data-pref"),
				value: newVal
			}, function(xhr) {

			});
		});
		$("#settings_change_background").click(function() {
			$("#changeBackgroundModal").modal();
		});
		$(".backgroundOption").click(function() {
			MyHomeworkSpace.Pages.settings.setBackground("img:" + $(this).attr("data-bgIndex"));
			MyHomeworkSpace.API.post("prefs/set", {
				key: "background",
				value: "img:" + $(this).attr("data-bgIndex")
			}, function(xhr) {

			});
		});
		$("#backgroundColor").change(function() {
			if (MyHomeworkSpace.Pages.settings.hackyBackgroundColorTimeout !== undefined) {
				clearTimeout(MyHomeworkSpace.Pages.settings.hackyBackgroundColorTimeout);
			}

			var newBg = "clr:" + $(this).val();
			MyHomeworkSpace.Pages.settings.setBackground(newBg);

			// to avoid flooding the server with network traffic, use a timeout
			// the pref will only be saved if the user doesn't change the color for 200ms
			MyHomeworkSpace.Pages.settings.hackyBackgroundColorTimeout = setTimeout(function() {
				MyHomeworkSpace.API.post("prefs/set", {
					key: "background",
					value: newBg
				}, function(xhr) {

				});
			}, 300);
		});
	},
	open: function() {
		$("#settings_account_name").text(MyHomeworkSpace.Me.name);
		$("#settings_account_email").text(MyHomeworkSpace.Me.email);
	},
	setBackground: function(bgVal) {
		var bgType = bgVal.split(":")[0];
		var bgVal = bgVal.split(":")[1];
		if (bgType == "img") {
			$("body").css("background-image", "url(img/backgrounds/bg" + bgVal + ".jpg)");
			$("#topBar").removeClass("inverted");
			$("#sidebar").removeClass("inverted");
		} else if (bgType == "clr") {
			$("body").css("background-image", "none");
			$("body").css("background-color", bgVal);

			// text adjustment code
			// this will check if the color is bright, and if it is, invert the color of the tabs and navbar
			var newClr = bgVal.substr(1); // we are assuming it's in format #rrggbb
			// convert hex code into numbers
			var red = parseInt(newClr.substr(0, 2), 16);
			var green = parseInt(newClr.substr(2, 2), 16);
			var blue = parseInt(newClr.substr(4, 2), 16);

			if (red > 128 || green > 128 || blue > 128) {
				$("#topBar").addClass("inverted");
				$("#sidebar").addClass("inverted");
			} else {
				$("#topBar").removeClass("inverted");
				$("#sidebar").removeClass("inverted");
			}
		}
	}
};

function lulz() {
	document.getElementsByTagName("body").style.fontFamily = "Comic Sans MS";
}