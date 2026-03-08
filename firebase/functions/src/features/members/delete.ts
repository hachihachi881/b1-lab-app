import { HttpsError, onCall } from "firebase-functions/v2/https";

export const membersDelete = onCall(async () => {
    throw new HttpsError("unimplemented", "membersDelete is not implemented yet");
});
