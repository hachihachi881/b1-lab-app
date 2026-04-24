import { HttpsError, onCall } from "firebase-functions/v2/https";
import { FieldValue } from "firebase-admin/firestore";
import { getAuthContext } from "../../core/auth";
import { requireAdmin } from "../../core/guard";
import { ApiError } from "../../core/errors";
import { db } from "../../core/firestore";
import { PresentationsUpdateRequest } from "../../types/api";
import { SettingsGroups } from "../../types/domain";

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

export const presentationsUpdate = onCall(async (request) => {
    try {
        const ctx = await getAuthContext(request);
        
        // In Emulator mode, allow unauthenticated writes for development
        const isEmulator = process.env.FIRESTORE_EMULATOR_HOST ? true : false;
        if (!isEmulator) {
            requireAdmin(ctx);
        }

        const { id, presentation } = request.data as PresentationsUpdateRequest;
        if (!id || !presentation) throw new ApiError("invalidArgument", "id と presentation は必須です");

        // groupName が指定されている場合、妥当性をチェック（エミュレータではスキップ）
        if (presentation.groupName && !process.env.FIRESTORE_EMULATOR_HOST) {
            const groupsSnap = await db.collection("settings").doc("groups").get();
            const groups = groupsSnap.data() as SettingsGroups | undefined;
            if (!groups?.items || !groups.items.includes(presentation.groupName)) {
                throw new ApiError("invalidArgument", `有効なグループ名ではありません: ${presentation.groupName}`);
            }
        }

        const ref = db.collection("presentations").doc(id);
        const snap = await ref.get();
        if (!snap.exists) throw new ApiError("notFound", "指定された発表が存在しません");

        await ref.update({ ...presentation, updatedAt: FieldValue.serverTimestamp() });

        return { ok: true };
    } catch (e) {
        if (e instanceof ApiError) throw toHttps(e);
        if (e instanceof HttpsError) throw e;
        throw new HttpsError("internal", "予期しないエラーが発生しました");
    }
});
