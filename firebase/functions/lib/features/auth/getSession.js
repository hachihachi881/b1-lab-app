"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGetSession = void 0;
const https_1 = require("firebase-functions/v2/https");
const auth_1 = require("../../core/auth");
const errors_1 = require("../../core/errors");
exports.authGetSession = (0, https_1.onCall)(async (request) => {
    try {
        const ctx = await (0, auth_1.getAuthContext)(request);
        return {
            uid: ctx.uid,
            email: ctx.email,
            isAdmin: ctx.isAdmin,
        };
    }
    catch (e) {
        if (e instanceof errors_1.ApiError) {
            const codeMap = {
                unauthenticated: "unauthenticated",
                permissionDenied: "permission-denied",
                invalidArgument: "invalid-argument",
                notFound: "not-found",
                internal: "internal",
            };
            throw new https_1.HttpsError(codeMap[e.code] ?? "internal", e.message);
        }
        throw new https_1.HttpsError("internal", "予期しないエラーが発生しました");
    }
});
