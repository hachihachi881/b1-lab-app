import { HttpsError, onCall } from "firebase-functions/v2/https";

export const settingsUpdate = onCall(async () => {
    throw new HttpsError("unimplemented", "settingsUpdate is not implemented yet");
});
