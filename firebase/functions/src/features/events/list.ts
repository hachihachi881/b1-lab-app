import { HttpsError, onCall } from "firebase-functions/v2/https";

export const eventsList = onCall(async () => {
    throw new HttpsError("unimplemented", "eventsList is not implemented yet");
});
