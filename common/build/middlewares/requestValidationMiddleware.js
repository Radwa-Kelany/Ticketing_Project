"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationRequest = void 0;
const express_validator_1 = require("express-validator");
const customError_1 = require("../errors/customError");
const validationRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new customError_1.RequestValidationError(errors.array());
    }
    next();
};
exports.validationRequest = validationRequest;
