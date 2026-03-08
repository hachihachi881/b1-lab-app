import { HttpsError, onCall } from "firebase-functions/v2/https";

export const teaPartiesDelete = onCall(async () => {
    throw new HttpsError("unimplemented", "teaPartiesDelete is not implemented yet");
});
