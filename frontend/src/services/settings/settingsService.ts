import { callFunction } from "../api/callableClient";
import { ApiResponse } from "../api/types";

export type Settings = {
    grades: { items: string[] };
    presentationTypes: { items: string[] };
    groups: { items: string[] };
    colors: {
        gradeColors?: Record<string, string>;
        groupColors?: Record<string, string>;
        scheduleTypeColors?: Record<string, string>;
        eventTypeColors?: Record<string, string>;
        presentationKindColors?: Record<string, string>;
    };
};

export const settingsGet = async (): Promise<ApiResponse<Settings>> => {
    const data = await callFunction<undefined, Settings>("settingsGet");
    return { ok: true, data };
};

export const settingsUpdate = async (
    payload: Partial<Settings>
): Promise<ApiResponse<void>> => {
    await callFunction<Partial<Settings>, void>("settingsUpdate", payload);
    return { ok: true };
};
