"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    code;
    constructor(code, message) {
        super(message);
        this.code = code;
        this.name = "ApiError";
    }
}
exports.ApiError = ApiError;
