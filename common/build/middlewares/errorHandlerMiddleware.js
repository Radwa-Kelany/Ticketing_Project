"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const customError_1 = require("../errors/customError");
const errorHandler = (err, req, res, next) => {
    if (err instanceof customError_1.CustomError) {
        res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }
    else {
        res.status(400).send({ message: err.message });
    }
    next();
};
exports.errorHandler = errorHandler;
