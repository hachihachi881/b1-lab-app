import { onCall } from "firebase-functions/v2/https";
import { db } from "../../core/firestore";
import { PresentationsListResponse } from "../../types/api";
import { Presentation } from "../../types/domain";

export const presentationsList = onCall(async (): Promise<PresentationsListResponse> => {
    const snap = await db.collection("presentations").orderBy("date", "desc").get();
    const items = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Presentation),
    }));
    return { items };
});
