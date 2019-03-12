var errorMap = {
	"bad_totp_code": "The two factor authentication code you entered is incorrect.",
	"bb_no_grade": "We couldn't find what grade you're in. If you're a faculty member, this is a known issue that we're working to fix. If you're a student, please contact us with the Feedback button at the top-right.",
	"bb_signin_error": "There was an error signing you in. Are you sure the password is correct?",
	"bb_signin_rate_limit": "We're sorry, but schedule importing is currently unavailable. Try again in 30 minutes.",
	"dalton_creds_incorrect": "The username or password was incorrect.",
	"disconnected": "You're disconnected from the Internet. Try that again once you've reconnected.",
	"missing_params": "Required parameters were missing from the request.",
	"internal_server_error": "An internal server error occurred while processing the request.",
	"invalid_params": "Some parameters of the request were invalid.",
	"user_record_missing": "Your user ID record is missing from the database. Please contact hello@myhomework.space for assistance."
};

export default {
	getFriendlyString: function(key) {
		if (errorMap[key]) {
			return errorMap[key];
		}
		return "An unknown error (" + key + ") occurred.";
	}
};