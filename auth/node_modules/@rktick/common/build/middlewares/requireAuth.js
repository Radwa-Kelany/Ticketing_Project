"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const customError_1 = require("../errors/customError");
const requireAuth = (req, res, next) => {
    if (!req.currentUser) {
        throw new customError_1.NotAuthorizedError();
    }
    next();
};
exports.requireAuth = requireAuth;
