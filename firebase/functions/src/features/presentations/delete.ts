import { HttpsError, onCall } from "firebase-functions/v2/https";

export const presentationsDelete = onCall(async () => {
    throw new HttpsError("unimplemented", "presentationsDelete is not implemented yet");
});
