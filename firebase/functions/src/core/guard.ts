import { ApiError } from "./errors";
import { AuthContext } from "./auth";

export const requireMember = (ctx: AuthContext): void => {
    if (!ctx.uid) {
        throw new ApiError("unauthenticated", "ログインが必要です");
    }
};

export const requireAdmin = (ctx: AuthContext): void => {
    if (!ctx.isAdmin) {
        throw new ApiError("permissionDenied", "管理者権限が必要です");
    }
};
