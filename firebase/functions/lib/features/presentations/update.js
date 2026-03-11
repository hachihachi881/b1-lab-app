"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.presentationsUpdate = void 0;
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("firebase-admin/firestore");
const auth_1 = require("../../core/auth");
const guard_1 = require("../../core/guard");
const errors_1 = require("../../core/errors");
const firestore_2 = require("../../core/firestore");
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
exports.presentationsUpdate = (0, https_1.onCall)(async (request) => {
    try {
        const ctx = await (0, auth_1.getAuthContext)(request);
        (0, guard_1.requireAdmin)(ctx);
        const { id, presentation } = request.data;
        if (!id || !presentation)
            throw new errors_1.ApiError("invalidArgument", "id と presentation は必須です");
        const ref = firestore_2.db.collection("presentations").doc(id);
        const snap = await ref.get();
        if (!snap.exists)
            throw new errors_1.ApiError("notFound", "指定された発表が存在しません");
        await ref.update({ ...presentation, updatedAt: firestore_1.FieldValue.serverTimestamp() });
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
