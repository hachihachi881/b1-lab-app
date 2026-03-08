import {
    Event,
    Member,
    Presentation,
    SettingsColors,
    SettingsGrades,
    SettingsGroups,
    SettingsPresentationTypes,
    TeaParty,
} from "./domain";

export type ApiResponse<T> = {
    ok: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
    };
};

export type AuthGetSessionResponse = {
    uid: string;
    email: string;
    isAdmin: boolean;
};

export type MembersListResponse = {
    members: Array<Member & { uid: string }>;
};

export type MembersRegisterRequest = {
    uid: string;
    member: Omit<Member, "createdAt" | "updatedAt">;
};

export type MembersUpdateRequest = {
    uid: string;
    member: Partial<Omit<Member, "createdAt" | "updatedAt">>;
};

export type MembersDeleteRequest = {
    uid: string;
};

export type PresentationsListResponse = {
    items: Array<Presentation & { id: string }>;
};

export type PresentationsCreateRequest = {
    presentation: Omit<Presentation, "createdAt" | "updatedAt">;
};

export type PresentationsUpdateRequest = {
    id: string;
    presentation: Partial<Omit<Presentation, "createdAt" | "updatedAt">>;
};

export type PresentationsDeleteRequest = {
    id: string;
};

export type EventsListResponse = {
    items: Array<Event & { id: string }>;
};

export type EventsCreateRequest = {
    event: Omit<Event, "createdAt" | "updatedAt">;
};

export type EventsUpdateRequest = {
    id: string;
    event: Partial<Omit<Event, "createdAt" | "updatedAt">>;
};

export type EventsDeleteRequest = {
    id: string;
};

export type TeaPartiesListResponse = {
    items: Array<TeaParty & { id: string }>;
};

export type TeaPartiesCreateRequest = {
    teaParty: Omit<TeaParty, "createdAt" | "updatedAt">;
};

export type TeaPartiesUpdateRequest = {
    id: string;
    teaParty: Partial<Omit<TeaParty, "createdAt" | "updatedAt">>;
};

export type TeaPartiesDeleteRequest = {
    id: string;
};

export type SettingsGetResponse = {
    grades: SettingsGrades;
    presentationTypes: SettingsPresentationTypes;
    groups: SettingsGroups;
    colors: SettingsColors;
};

export type SettingsUpdateRequest = Partial<SettingsGetResponse>;
