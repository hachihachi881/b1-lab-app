import { HttpsError, onCall } from "firebase-functions/v2/https";

export const teaPartiesList = onCall(async () => {
    throw new HttpsError("unimplemented", "teaPartiesList is not implemented yet");
});
