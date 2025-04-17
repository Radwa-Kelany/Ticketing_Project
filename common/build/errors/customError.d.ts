import { ValidationError } from "express-validator";
export declare abstract class CustomError extends Error {
    abstract statusCode: number;
    constructor();
    abstract serializeErrors(): {
        message: string;
        field?: string;
    }[];
}
export declare class NotFoundError extends CustomError {
    statusCode: number;
    constructor();
    serializeErrors(): {
        message: string;
    }[];
}
export declare class DBConnectionError extends CustomError {
    statusCode: number;
    constructor();
    serializeErrors(): {
        message: string;
    }[];
}
export declare class BadRequestError extends CustomError {
    msg: string;
    statusCode: number;
    constructor(msg: string);
    serializeErrors(): {
        message: string;
    }[];
}
export declare class RequestValidationError extends CustomError {
    errors: ValidationError[];
    statusCode: number;
    constructor(errors: ValidationError[]);
    serializeErrors(): {
        message: any;
    }[];
}
export declare class NotAuthorizedError extends CustomError {
    statusCode: number;
    constructor();
    serializeErrors(): {
        message: string;
    }[];
}
