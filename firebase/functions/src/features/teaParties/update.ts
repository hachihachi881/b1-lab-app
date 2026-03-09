import { HttpsError, onCall } from "firebase-functions/v2/https";
import { FieldValue } from "firebase-admin/firestore";
import { getAuthContext } from "../../core/auth";
import { requireAdmin } from "../../core/guard";
import { ApiError } from "../../core/errors";
import { db } from "../../core/firestore";
import { TeaPartiesUpdateRequest } from "../../types/api";

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

export const teaPartiesUpdate = onCall(async (request) => {
    try {
        const ctx = await getAuthContext(request);
        requireAdmin(ctx);

        const { id, teaParty } = request.data as TeaPartiesUpdateRequest;
        if (!id || !teaParty) throw new ApiError("invalidArgument", "id と teaParty は必須です");

        const ref = db.collection("teaParties").doc(id);
        const snap = await ref.get();
        if (!snap.exists) throw new ApiError("notFound", "指定されたお茶会が存在しません");

        await ref.update({ ...teaParty, updatedAt: FieldValue.serverTimestamp() });

        return { ok: true };
    } catch (e) {
        if (e instanceof ApiError) throw toHttps(e);
        if (e instanceof HttpsError) throw e;
        throw new HttpsError("internal", "予期しないエラーが発生しました");
    }
});
