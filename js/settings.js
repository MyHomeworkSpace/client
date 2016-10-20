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
	},
	open: function() {

	},
	cache: {}
};
