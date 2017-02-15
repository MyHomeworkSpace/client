MyHomeworkSpace.Utils = {
	findMonday: function() {
		var returnDate = moment();
		while (returnDate.day() != 1) {
			returnDate.subtract(1, "day");
		}
		return returnDate;
	}
};
