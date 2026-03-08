import { HttpsError, onCall } from "firebase-functions/v2/https";

export const membersList = onCall(async () => {
    throw new HttpsError("unimplemented", "membersList is not implemented yet");
});
