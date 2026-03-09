import { HttpsError, onCall } from "firebase-functions/v2/https";
import { getAuthContext } from "../../core/auth";
import { requireAdmin } from "../../core/guard";
import { ApiError } from "../../core/errors";
import { db } from "../../core/firestore";
import { MembersRegisterRequest } from "../../types/api";
import { FieldValue } from "firebase-admin/firestore";

const toHttps = (e: ApiError): HttpsError => {
    const map: Record<string, HttpsError["code"]> = {
        unauthenticated: "unauthenticated",
        permissionDenied: "permission-denied",
        invalidArgument: "invalid-argument",
        notFound: "not-found",
        internal: "internal",
    };
    return new HttpsError(map[e.code] ?? "internal", e.message);
};

export const membersRegister = onCall(async (request) => {
    try {
        const ctx = await getAuthContext(request);
        requireAdmin(ctx);

        const { uid, member } = request.data as MembersRegisterRequest;
        if (!uid || !member) {
            throw new ApiError("invalidArgument", "uid と member は必須です");
        }

        await db.collection("members").doc(uid).set({
            ...member,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });

        return { ok: true };
    } catch (e) {
        if (e instanceof ApiError) throw toHttps(e);
        if (e instanceof HttpsError) throw e;
        throw new HttpsError("internal", "予期しないエラーが発生しました");
    }
});
