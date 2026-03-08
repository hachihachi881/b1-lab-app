import { HttpsError, onCall } from "firebase-functions/v2/https";

export const eventsCreate = onCall(async () => {
    throw new HttpsError("unimplemented", "eventsCreate is not implemented yet");
});
