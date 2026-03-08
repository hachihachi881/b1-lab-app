import { callFunction } from "../api/callableClient";
import { ApiResponse } from "../api/types";

export type PresentationSlot = {
    kind: "presenter" | "break" | "host";
    startAt: string;
    endAt: string;
    memberUid?: string;
};

export type Presentation = {
    id: string;
    date: string;
    type: string;
    slots: PresentationSlot[];
    notes?: string;
};

export const presentationsList = async (): Promise<ApiResponse<Presentation[]>> => {
    const data = await callFunction<undefined, { items: Presentation[] }>("presentationsList");
    return { ok: true, data: data.items };
};

export const presentationsCreate = async (payload: {
    presentation: Omit<Presentation, "id">;
}): Promise<ApiResponse<void>> => {
    await callFunction<typeof payload, void>("presentationsCreate", payload);
    return { ok: true };
};

export const presentationsUpdate = async (payload: {
    id: string;
    presentation: Partial<Omit<Presentation, "id">>;
}): Promise<ApiResponse<void>> => {
    await callFunction<typeof payload, void>("presentationsUpdate", payload);
    return { ok: true };
};

export const presentationsDelete = async (payload: {
    id: string;
}): Promise<ApiResponse<void>> => {
    await callFunction<typeof payload, void>("presentationsDelete", payload);
    return { ok: true };
};
