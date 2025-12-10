
class CustomExceptions extends Error {

    public errorCode: string;
    public message: string;

    constructor(errorCode: string) {
        super();
        this.errorCode = errorCode || "000";
        this.message = this.getMessage(errorCode);
    }

    private getMessage(errorCode: string): string {
        const MESSAGE_CATALOGUE: { [key: string]: string } = {
            "001": "incorrect_request_method",
            "002": "incorrect_class",
            "003": "method_not_exist",
            "004": "no_user",
            "005": "invalid_credentials",
            "006": "not_token",
            "007": "empty_params",
        };
        return MESSAGE_CATALOGUE[errorCode] || "unknown_error";
    }

    GetOptions() {
        return { error: true, msg: this.message, error_code: this.errorCode };
    }

}

export { CustomExceptions };
