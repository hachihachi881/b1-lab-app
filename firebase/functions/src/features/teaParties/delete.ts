import { HttpsError, onCall } from "firebase-functions/v2/https";
import { getAuthContext } from "../../core/auth";
import { requireAdmin } from "../../core/guard";
import { ApiError } from "../../core/errors";
import { db } from "../../core/firestore";
import { TeaPartiesDeleteRequest } from "../../types/api";

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

export const teaPartiesDelete = onCall(async (request) => {
    try {
        const ctx = await getAuthContext(request);
        requireAdmin(ctx);

        const { id } = request.data as TeaPartiesDeleteRequest;
        if (!id) throw new ApiError("invalidArgument", "id は必須です");

        const ref = db.collection("teaParties").doc(id);
        const snap = await ref.get();
        if (!snap.exists) throw new ApiError("notFound", "指定されたお茶会が存在しません");

        await ref.delete();

        return { ok: true };
    } catch (e) {
        if (e instanceof ApiError) throw toHttps(e);
        if (e instanceof HttpsError) throw e;
        throw new HttpsError("internal", "予期しないエラーが発生しました");
    }
});
