"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthContext = void 0;
const errors_1 = require("./errors");
const firestore_1 = require("./firestore");
const getAuthContext = async (request) => {
    if (!request.auth) {
        throw new errors_1.ApiError("unauthenticated", "ログインが必要です");
    }
    const { uid } = request.auth;
    const email = request.auth.token.email ?? "";
    const memberSnap = await firestore_1.db.collection("members").doc(uid).get();
    const isAdmin = memberSnap.exists ? (memberSnap.data()?.isAdmin ?? false) : false;
    return { uid, email, isAdmin };
};
exports.getAuthContext = getAuthContext;
