import { HttpsError, onCall } from "firebase-functions/v2/https";
import { getAuthContext } from "../../core/auth";
import { ApiError } from "../../core/errors";
import { AuthGetSessionResponse } from "../../types/api";

export const authGetSession = onCall(async (request): Promise<AuthGetSessionResponse> => {
    try {
        const ctx = await getAuthContext(request);
        return {
            uid: ctx.uid,
            email: ctx.email,
            isAdmin: ctx.isAdmin,
        };
    } catch (e) {
        if (e instanceof ApiError) {
            const codeMap: Record<string, HttpsError["code"]> = {
                unauthenticated: "unauthenticated",
                permissionDenied: "permission-denied",
                invalidArgument: "invalid-argument",
                notFound: "not-found",
                internal: "internal",
            };
            throw new HttpsError(codeMap[e.code] ?? "internal", e.message);
        }
        throw new HttpsError("internal", "予期しないエラーが発生しました");
    }
});
