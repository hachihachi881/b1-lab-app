import { HttpsError, onCall } from "firebase-functions/v2/https";

export const presentationsCreate = onCall(async () => {
    throw new HttpsError("unimplemented", "presentationsCreate is not implemented yet");
});
