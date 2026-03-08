import { callFunction } from "../api/callableClient";
import { ApiResponse } from "../api/types";

export type AuthSession = {
    uid: string;
    email: string;
    isAdmin: boolean;
};

export const authGetSession = async (): Promise<ApiResponse<AuthSession>> => {
    const data = await callFunction<undefined, AuthSession>("authGetSession");
    return { ok: true, data };
};
