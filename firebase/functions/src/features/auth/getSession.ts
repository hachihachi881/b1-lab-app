import { HttpsError, onCall } from "firebase-functions/v2/https";

export const authGetSession = onCall(async () => {
    throw new HttpsError("unimplemented", "authGetSession is not implemented yet");
});
