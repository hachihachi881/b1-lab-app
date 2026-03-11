import { db } from "../../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
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
    try {
        const [gradesSnap, presentationTypesSnap, groupsSnap, colorsSnap] = await Promise.all([
            getDoc(doc(db, "settings", "grades")),
            getDoc(doc(db, "settings", "presentationTypes")),
            getDoc(doc(db, "settings", "groups")),
            getDoc(doc(db, "settings", "colors")),
        ]);

        const data: Settings = {
            grades: gradesSnap.exists() ? gradesSnap.data() as { items: string[] } : { items: [] },
            presentationTypes: presentationTypesSnap.exists() ? presentationTypesSnap.data() as { items: string[] } : { items: [] },
            groups: groupsSnap.exists() ? groupsSnap.data() as { items: string[] } : { items: [] },
            colors: colorsSnap.exists() ? colorsSnap.data() as Settings['colors'] : {},
        };

        return { ok: true, data };
    } catch (error) {
        console.error("設定取得エラー:", error);
        return { ok: false, error: "設定の取得に失敗しました" };
    }
};

export const settingsUpdate = async (
    payload: Partial<Settings>
): Promise<ApiResponse<void>> => {
    try {
        const promises = [];
        if (payload.grades) {
            promises.push(setDoc(doc(db, "settings", "grades"), payload.grades));
        }
        if (payload.presentationTypes) {
            promises.push(setDoc(doc(db, "settings", "presentationTypes"), payload.presentationTypes));
        }
        if (payload.groups) {
            promises.push(setDoc(doc(db, "settings", "groups"), payload.groups));
        }
        if (payload.colors) {
            promises.push(setDoc(doc(db, "settings", "colors"), payload.colors));
        }

        await Promise.all(promises);
        return { ok: true };
    } catch (error) {
        console.error("設定更新エラー:", error);
        return { ok: false, error: "設定の更新に失敗しました" };
    }
};
