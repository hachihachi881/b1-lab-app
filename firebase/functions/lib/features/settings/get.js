"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsGet = void 0;
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("../../core/firestore");
exports.settingsGet = (0, https_1.onCall)(async () => {
    const [grades, presentationTypes, groups, colors] = await Promise.all([
        firestore_1.db.collection("settings").doc("grades").get(),
        firestore_1.db.collection("settings").doc("presentationTypes").get(),
        firestore_1.db.collection("settings").doc("groups").get(),
        firestore_1.db.collection("settings").doc("colors").get(),
    ]);
    return {
        grades: grades.data() ?? { items: [] },
        presentationTypes: presentationTypes.data() ?? { items: [] },
        groups: groups.data() ?? { items: [] },
        colors: colors.data() ?? {},
    };
});
