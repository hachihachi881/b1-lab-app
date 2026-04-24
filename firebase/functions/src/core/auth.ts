import { CallableRequest } from "firebase-functions/v2/https";
import { ApiError } from "./errors";
import { db } from "./firestore";

export type AuthContext = {
    uid: string;
    email: string;
    isAdmin: boolean;
};

export const getAuthContext = async (request: CallableRequest): Promise<AuthContext> => {
    // エミュレータ環境では開発モード：認証なしで管理者として動作
    if (process.env.FIRESTORE_EMULATOR_HOST) {
        return {
            uid: request.auth?.uid ?? "dev-user",
            email: request.auth?.token.email ?? "dev@example.com",
            isAdmin: true,
        };
    }

    if (!request.auth) {
        throw new ApiError("unauthenticated", "ログインが必要です");
    }

    const { uid } = request.auth;
    const email = request.auth.token.email ?? "";

    const memberSnap = await db.collection("members").doc(uid).get();
    const isAdmin = memberSnap.exists ? (memberSnap.data()?.isAdmin ?? false) : false;

    return { uid, email, isAdmin };
}; 
