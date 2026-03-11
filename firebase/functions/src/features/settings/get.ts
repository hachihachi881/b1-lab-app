import { onCall } from "firebase-functions/v2/https";
import { db } from "../../core/firestore";

export const settingsGet = onCall(async () => {
    const [grades, presentationTypes, groups, colors] = await Promise.all([
        db.collection("settings").doc("grades").get(),
        db.collection("settings").doc("presentationTypes").get(),
        db.collection("settings").doc("groups").get(),
        db.collection("settings").doc("colors").get(),
    ]);

    return {
        grades: grades.data() ?? { items: [] },
        presentationTypes: presentationTypes.data() ?? { items: [] },
        groups: groups.data() ?? { items: [] },
        colors: colors.data() ?? {},
    };
});
