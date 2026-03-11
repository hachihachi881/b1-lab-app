import { onCall } from "firebase-functions/v2/https";
import { db } from "../../core/firestore";
import { MembersListResponse } from "../../types/api";
import { Member } from "../../types/domain";

export const membersList = onCall(async (): Promise<MembersListResponse> => {
    const snap = await db.collection("members").get();
    const members = snap.docs.map((doc) => ({
        uid: doc.id,
        ...(doc.data() as Member),
    }));
    return { members };
});
