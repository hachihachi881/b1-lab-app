import { HttpsError, onCall } from "firebase-functions/v2/https";

export const eventsUpdate = onCall(async () => {
    throw new HttpsError("unimplemented", "eventsUpdate is not implemented yet");
});
