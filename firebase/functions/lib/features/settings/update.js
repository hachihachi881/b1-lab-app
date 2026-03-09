"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsUpdate = void 0;
const https_1 = require("firebase-functions/v2/https");
const auth_1 = require("../../core/auth");
const guard_1 = require("../../core/guard");
const errors_1 = require("../../core/errors");
const firestore_1 = require("../../core/firestore");
const toHttps = (e) => {
    const map = {
        unauthenticated: "unauthenticated",
        permissionDenied: "permission-denied",
        invalidArgument: "invalid-argument",
        notFound: "not-found",
        internal: "internal",
    };
    return new https_1.HttpsError(map[e.code] ?? "internal", e.message);
};
exports.settingsUpdate = (0, https_1.onCall)(async (request) => {
    try {
        const ctx = await (0, auth_1.getAuthContext)(request);
        (0, guard_1.requireAdmin)(ctx);
        const payload = request.data;
        const keys = ["grades", "presentationTypes", "groups", "colors"];
        await Promise.all(keys
            .filter((key) => payload[key] !== undefined)
            .map((key) => firestore_1.db.collection("settings").doc(key).set(payload[key], { merge: true })));
        return { ok: true };
    }
    catch (e) {
        if (e instanceof errors_1.ApiError)
            throw toHttps(e);
        if (e instanceof https_1.HttpsError)
            throw e;
        throw new https_1.HttpsError("internal", "予期しないエラーが発生しました");
    }
});
