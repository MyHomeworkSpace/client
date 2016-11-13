MyHomeworkSpace.Pages.settings = {
	init: function() {
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
			$("body").css("background-image", "url(img/backgrounds/bg" + $(this).attr("data-bgIndex") + ".jpg)");
			MyHomeworkSpace.API.post("prefs/set", {
				key: "background",
				value: "img:" + $(this).attr("data-bgIndex")
			}, function(xhr) {

			});
		});
	},
	open: function() {
		$("#settings_account_name").text(MyHomeworkSpace.Me.name);
		$("#settings_account_email").text(MyHomeworkSpace.Me.email);
		MyHomeworkSpace.API.get("prefs/get/background", {}, function(xhr) {
			if (xhr.responseJSON.status != "error") {
				var bgVal = xhr.responseJSON.pref.value;
				MyHomeworkSpace.Pages.settings.cache["background"] = bgVal;
				var bgType = bgVal.split(":")[0];
				var bgVal = bgVal.split(":")[1];
				if (bgType == "img") {
					$("body").css("background-image", "url(img/backgrounds/bg" + bgVal + ".jpg)");
				}
			}
		});
	},
	cache: {}
};
