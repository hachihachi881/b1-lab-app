"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.presentationsList = void 0;
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("../../core/firestore");
exports.presentationsList = (0, https_1.onCall)(async () => {
    const snap = await firestore_1.db.collection("presentations").orderBy("date", "desc").get();
    const items = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    return { items };
});
