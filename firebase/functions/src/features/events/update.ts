import { HttpsError, onCall } from "firebase-functions/v2/https";
import { FieldValue } from "firebase-admin/firestore";
import { getAuthContext } from "../../core/auth";
import { requireAdmin } from "../../core/guard";
import { ApiError } from "../../core/errors";
import { db } from "../../core/firestore";
import { EventsUpdateRequest } from "../../types/api";

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

export const eventsUpdate = onCall(async (request) => {
    try {
        const ctx = await getAuthContext(request);
        requireAdmin(ctx);

        const { id, event } = request.data as EventsUpdateRequest;
        if (!id || !event) throw new ApiError("invalidArgument", "id と event は必須です");

        const ref = db.collection("events").doc(id);
        const snap = await ref.get();
        if (!snap.exists) throw new ApiError("notFound", "指定されたイベントが存在しません");

        await ref.update({ ...event, updatedAt: FieldValue.serverTimestamp() });

        return { ok: true };
    } catch (e) {
        if (e instanceof ApiError) throw toHttps(e);
        if (e instanceof HttpsError) throw e;
        throw new HttpsError("internal", "予期しないエラーが発生しました");
    }
});
