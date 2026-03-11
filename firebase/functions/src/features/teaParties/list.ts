import { onCall } from "firebase-functions/v2/https";
import { db } from "../../core/firestore";
import { TeaPartiesListResponse } from "../../types/api";
import { TeaParty } from "../../types/domain";

export const teaPartiesList = onCall(async (): Promise<TeaPartiesListResponse> => {
    const snap = await db.collection("teaParties").orderBy("createdAt", "desc").get();
    const items = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as TeaParty),
    }));
    return { items };
});
