import { HttpsError, onCall } from "firebase-functions/v2/https";
import { FieldValue } from "firebase-admin/firestore";
import { getAuthContext } from "../../core/auth";
import { requireAdmin } from "../../core/guard";
import { ApiError } from "../../core/errors";
import { db } from "../../core/firestore";
import { EventsCreateRequest } from "../../types/api";

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

export const eventsCreate = onCall(async (request) => {
    try {
        const ctx = await getAuthContext(request);
        requireAdmin(ctx);

        const { event } = request.data as EventsCreateRequest;
        if (!event) throw new ApiError("invalidArgument", "event は必須です");

        const ref = await db.collection("events").add({
            ...event,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });

        return { ok: true, id: ref.id };
    } catch (e) {
        if (e instanceof ApiError) throw toHttps(e);
        if (e instanceof HttpsError) throw e;
        throw new HttpsError("internal", "予期しないエラーが発生しました");
    }
});
