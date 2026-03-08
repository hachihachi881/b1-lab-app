import { HttpsError, onCall } from "firebase-functions/v2/https";

export const membersUpdate = onCall(async () => {
    throw new HttpsError("unimplemented", "membersUpdate is not implemented yet");
});
