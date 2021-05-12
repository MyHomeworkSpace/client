let errorMap = {
	"already_enrolled": "You've already connected that school to your MyHomeworkSpace account.",
	"already_verified": "You've already verified your email.",
	"bad_totp_code": "The two factor authentication code you entered is incorrect.",
	"bb_no_grade": "We couldn't find what grade you're in. If you're a faculty member, this is a known issue that we're working to fix. If you're a student, please contact us with the Feedback button at the top-right.",
	"creds_incorrect": "The username or password was incorrect.",
	"csrfToken_invalid": "There's something wrong with your session ID. Try clearing your cookies, and if that doesn't fix it, contact us at hello@myhomework.space for assistance.",
	"disconnected": "You're disconnected from the Internet. Try that again once you've reconnected.",
	"duo_denied": "You rejected the two-factor authentication request.",
	"email_exists": "There's already a MyHomeworkSpace account with that email address.",
	"forbidden": "You don't have permission to do that.",
	"internal_server_error": "An internal server error occurred while processing the request.",
	"insecure_password": "The password you picked isn't secure enough. Please try again.",
	"invalid_params": "Some parameters of the request were invalid.",
	"logged_out": "Your session has timed out. Please reload the page and try that again.",
	"missing_params": "Required parameters were missing from the request.",
	"no_account": "There's no MyHomeworkSpace account with that email address.",
	"not_enrolled": "You need to connect that school to your MyHomeworkSpace account first.",
	"not_found": "That item could not be found.",
	"password_incorrect": "The password was incorrect.",
	"unsupported_operation": "That school doesn't support that action.",
	"user_record_missing": "Your user ID record is missing from the database. Please contact hello@myhomework.space for assistance.",
};

export default {
	getFriendlyString: function(key) {
		if (errorMap[key]) {
			return errorMap[key];
		}
		return "An unknown error (" + key + ") occurred.";
	}
};