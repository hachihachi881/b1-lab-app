import { HttpsError, onCall } from "firebase-functions/v2/https";

export const eventsDelete = onCall(async () => {
    throw new HttpsError("unimplemented", "eventsDelete is not implemented yet");
});
