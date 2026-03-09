"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.membersList = void 0;
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("../../core/firestore");
exports.membersList = (0, https_1.onCall)(async () => {
    const snap = await firestore_1.db.collection("members").get();
    const members = snap.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
    }));
    return { members };
});
