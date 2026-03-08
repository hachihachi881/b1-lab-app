import { HttpsError, onCall } from "firebase-functions/v2/https";

export const presentationsUpdate = onCall(async () => {
    throw new HttpsError("unimplemented", "presentationsUpdate is not implemented yet");
});
