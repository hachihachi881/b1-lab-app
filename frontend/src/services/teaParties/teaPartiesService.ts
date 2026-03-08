import { callFunction } from "../api/callableClient";
import { ApiResponse } from "../api/types";

export type TeaParty = {
    id: string;
    title: string;
    body: string;
    date: string;
    nextDate?: string;
};

export const teaPartiesList = async (): Promise<ApiResponse<TeaParty[]>> => {
    const data = await callFunction<undefined, { items: TeaParty[] }>("teaPartiesList");
    return { ok: true, data: data.items };
};

export const teaPartiesCreate = async (payload: {
    teaParty: Omit<TeaParty, "id">;
}): Promise<ApiResponse<void>> => {
    await callFunction<typeof payload, void>("teaPartiesCreate", payload);
    return { ok: true };
};

export const teaPartiesUpdate = async (payload: {
    id: string;
    teaParty: Partial<Omit<TeaParty, "id">>;
}): Promise<ApiResponse<void>> => {
    await callFunction<typeof payload, void>("teaPartiesUpdate", payload);
    return { ok: true };
};

export const teaPartiesDelete = async (payload: {
    id: string;
}): Promise<ApiResponse<void>> => {
    await callFunction<typeof payload, void>("teaPartiesDelete", payload);
    return { ok: true };
};
