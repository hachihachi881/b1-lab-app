import { callFunction } from "../api/callableClient";
import { ApiResponse } from "../api/types";

export type Member = {
    uid: string;
    email: string;
    name: string;
    isAdmin: boolean;
    grade: string;
    groupName: string;
};

export const membersList = async (): Promise<ApiResponse<Member[]>> => {
    const data = await callFunction<undefined, { members: Member[] }>("membersList");
    return { ok: true, data: data.members };
};

export const membersRegister = async (payload: {
    uid: string;
    member: Omit<Member, "uid">;
}): Promise<ApiResponse<void>> => {
    await callFunction<typeof payload, void>("membersRegister", payload);
    return { ok: true };
};

export const membersUpdate = async (payload: {
    uid: string;
    member: Partial<Omit<Member, "uid">>;
}): Promise<ApiResponse<void>> => {
    await callFunction<typeof payload, void>("membersUpdate", payload);
    return { ok: true };
};

export const membersDelete = async (payload: {
    uid: string;
}): Promise<ApiResponse<void>> => {
    await callFunction<typeof payload, void>("membersDelete", payload);
    return { ok: true };
};
