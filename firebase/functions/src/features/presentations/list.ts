import { HttpsError, onCall } from "firebase-functions/v2/https";

export const presentationsList = onCall(async () => {
    throw new HttpsError("unimplemented", "presentationsList is not implemented yet");
});
