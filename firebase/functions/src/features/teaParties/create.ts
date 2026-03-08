import { HttpsError, onCall } from "firebase-functions/v2/https";

export const teaPartiesCreate = onCall(async () => {
    throw new HttpsError("unimplemented", "teaPartiesCreate is not implemented yet");
});
