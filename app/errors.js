var errorMap = {
	"bb_signin_error": "There was an error signing you in. Are you sure the password is correct?",
	"bb_signin_rate_limit": "We're sorry, but schedule importing is currently unavailable. Try again in 30 minutes.",
	"dalton_creds_incorrect": "The username or password was incorrect.",
	"missing_params": "Required parameters were missing from the request.",
	"internal_server_error": "An internal server error occurred while processing the request.",
	"invalid_params": "Some parameters of the request were incorrect."
};

export default {
	getFriendlyString: function(key) {
		if (errorMap[key]) {
			return errorMap[key];
		}
		return "An unknown error (" + key + ") occurred.";	
	}
};