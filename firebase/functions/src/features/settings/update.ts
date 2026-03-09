import { HttpsError, onCall } from "firebase-functions/v2/https";
import { getAuthContext } from "../../core/auth";
import { requireAdmin } from "../../core/guard";
import { ApiError } from "../../core/errors";
import { db } from "../../core/firestore";

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

type SettingsPayload = {
    grades?: { items: string[] };
    presentationTypes?: { items: string[] };
    groups?: { items: string[] };
    colors?: Record<string, unknown>;
};

export const settingsUpdate = onCall(async (request) => {
    try {
        const ctx = await getAuthContext(request);
        requireAdmin(ctx);

        const payload = request.data as SettingsPayload;
        const keys = ["grades", "presentationTypes", "groups", "colors"] as const;

        await Promise.all(
            keys
                .filter((key) => payload[key] !== undefined)
                .map((key) =>
                    db.collection("settings").doc(key).set(payload[key]!, { merge: true })
                )
        );

        return { ok: true };
    } catch (e) {
        if (e instanceof ApiError) throw toHttps(e);
        if (e instanceof HttpsError) throw e;
        throw new HttpsError("internal", "予期しないエラーが発生しました");
    }
});
