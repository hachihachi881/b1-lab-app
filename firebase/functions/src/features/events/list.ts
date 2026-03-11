import { onCall } from "firebase-functions/v2/https";
import { db } from "../../core/firestore";
import { EventsListResponse } from "../../types/api";
import { Event } from "../../types/domain";

export const eventsList = onCall(async (): Promise<EventsListResponse> => {
    const snap = await db.collection("events").orderBy("eventDate", "desc").get();
    const items = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Event),
    }));
    return { items };
});
