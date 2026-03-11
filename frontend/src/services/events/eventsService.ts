import { callFunction } from "../api/callableClient";
import { ApiResponse } from "../api/types";

export type Event = {
    id: string;
    eventDate: string;
    eventType: "monthly" | "weekly";
    title: string;
    body: string;
    participantUids?: string[];
};

export const eventsList = async (): Promise<ApiResponse<Event[]>> => {
    const data = await callFunction<undefined, { items: Event[] }>("eventsList");
    return { ok: true, data: data.items };
};

export const eventsCreate = async (payload: {
    event: Omit<Event, "id">;
}): Promise<ApiResponse<void>> => {
    await callFunction<typeof payload, void>("eventsCreate", payload);
    return { ok: true };
};

export const eventsUpdate = async (payload: {
    id: string;
    event: Partial<Omit<Event, "id">>;
}): Promise<ApiResponse<void>> => {
    await callFunction<typeof payload, void>("eventsUpdate", payload);
    return { ok: true };
};

export const eventsDelete = async (payload: {
    id: string;
}): Promise<ApiResponse<void>> => {
    await callFunction<typeof payload, void>("eventsDelete", payload);
    return { ok: true };
};
