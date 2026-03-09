"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireMember = void 0;
const errors_1 = require("./errors");
const requireMember = (ctx) => {
    if (!ctx.uid) {
        throw new errors_1.ApiError("unauthenticated", "ログインが必要です");
    }
};
exports.requireMember = requireMember;
const requireAdmin = (ctx) => {
    if (!ctx.isAdmin) {
        throw new errors_1.ApiError("permissionDenied", "管理者権限が必要です");
    }
};
exports.requireAdmin = requireAdmin;
