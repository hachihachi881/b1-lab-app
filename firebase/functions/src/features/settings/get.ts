import { HttpsError, onCall } from "firebase-functions/v2/https";

export const settingsGet = onCall(async () => {
    throw new HttpsError("unimplemented", "settingsGet is not implemented yet");
});
