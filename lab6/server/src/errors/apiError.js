class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.status = status;
        this.errors = errors;
    }

    static BadRequestError(message, errors = []) {
        return new ApiError(400, message, errors);
    }
}

export {ApiError};