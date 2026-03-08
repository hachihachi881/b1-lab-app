import { HttpsError, onCall } from "firebase-functions/v2/https";

export const membersRegister = onCall(async () => {
    throw new HttpsError("unimplemented", "membersRegister is not implemented yet");
});
