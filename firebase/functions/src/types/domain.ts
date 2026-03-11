export type FirestoreDate = Date | string;

export type PresentationSlotKind = "presenter" | "break" | "host";
export type EventType = "monthly" | "weekly";

export type SettingsGrades = {
    items: string[];
};

export type SettingsPresentationTypes = {
    items: string[];
};

export type SettingsGroups = {
    items: string[];
};

export type SettingsColors = {
    gradeColors?: Record<string, string>;
    groupColors?: Record<string, string>;
    scheduleTypeColors?: Record<string, string>;
    eventTypeColors?: Record<string, string>;
    presentationKindColors?: Record<string, string>;
};

export type Member = {
    email: string;
    name: string;
    isAdmin: boolean;
    grade: string;
    groupName: string;
    createdAt: FirestoreDate;
    updatedAt: FirestoreDate;
};

export type PresentationSlot = {
    kind: PresentationSlotKind;
    startAt: FirestoreDate;
    endAt: FirestoreDate;
    memberUid?: string;
};

export type Presentation = {
    date: FirestoreDate;
    type: string;
    slots: PresentationSlot[];
    notes?: string;
    createdAt: FirestoreDate;
    updatedAt: FirestoreDate;
};

export type Event = {
    eventDate: FirestoreDate;
    eventType: EventType;
    title: string;
    body: string;
    participantUids?: string[];
    createdAt: FirestoreDate;
    updatedAt: FirestoreDate;
};

export type TeaParty = {
    title: string;
    body: string;
    date: FirestoreDate;
    nextDate?: FirestoreDate;
    createdAt: FirestoreDate;
    updatedAt: FirestoreDate;
};
