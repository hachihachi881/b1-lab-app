import { HttpsError, onCall } from "firebase-functions/v2/https";

export const teaPartiesUpdate = onCall(async () => {
    throw new HttpsError("unimplemented", "teaPartiesUpdate is not implemented yet");
});
