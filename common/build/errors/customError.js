"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotAuthorizedError = exports.RequestValidationError = exports.BadRequestError = exports.DBConnectionError = exports.NotFoundError = exports.CustomError = void 0;
class CustomError extends Error {
    constructor() {
        super();
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
exports.CustomError = CustomError;
class NotFoundError extends CustomError {
    constructor() {
        super();
        this.statusCode = 404;
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    serializeErrors() {
        return [{ message: "Not Found" }];
    }
}
exports.NotFoundError = NotFoundError;
class DBConnectionError extends CustomError {
    constructor() {
        super();
        this.statusCode = 500;
        Object.setPrototypeOf(this, DBConnectionError.prototype);
    }
    serializeErrors() {
        return [{ message: "Server Connection Error" }];
    }
}
exports.DBConnectionError = DBConnectionError;
class BadRequestError extends CustomError {
    constructor(msg) {
        super();
        this.msg = msg;
        this.statusCode = 400;
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
    serializeErrors() {
        return [{ message: this.msg }];
    }
}
exports.BadRequestError = BadRequestError;
class RequestValidationError extends CustomError {
    constructor(errors) {
        super();
        this.errors = errors;
        this.statusCode = 400;
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
    serializeErrors() {
        return this.errors.map(err => {
            return { message: err.msg };
        });
    }
}
exports.RequestValidationError = RequestValidationError;
class NotAuthorizedError extends CustomError {
    constructor() {
        super();
        this.statusCode = 401;
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }
    serializeErrors() {
        return [{ message: "Not Authorized User" }];
    }
}
exports.NotAuthorizedError = NotAuthorizedError;
