import { Presentation, PresentationSlot } from "../services/presentations/presentationsService";

export const PRESENTATION_KIND_LABELS: Record<PresentationSlot["kind"], string> = {
    presenter: "発表",
    break: "休憩",
    host: "司会",
};

const WEEKDAYS_JA = ["日", "月", "火", "水", "木", "金", "土"];

export function toDateKey(value: string | Date): string {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return value;
    }

    const date = typeof value === "string" ? new Date(value) : value;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function formatPresentationDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日(${WEEKDAYS_JA[date.getDay()]})`;
}

export function formatPresentationDateShort(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return `${date.getMonth() + 1}/${date.getDate()}(${WEEKDAYS_JA[date.getDay()]})`;
}

export function formatPresentationDateTime(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return `${formatPresentationDateShort(value)} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export function toLocalDateTimeInputValue(value?: string): string {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function fromLocalDateTimeInputValue(value: string): string {
    return new Date(value).toISOString();
}

export function sortPresentationsDesc(items: Presentation[]): Presentation[] {
    return [...items].sort((left, right) => {
        const leftTime = getPresentationStartDate(left)?.getTime() ?? new Date(left.date).getTime();
        const rightTime = getPresentationStartDate(right)?.getTime() ?? new Date(right.date).getTime();
        return rightTime - leftTime;
    });
}

export function getPresentationStartDate(presentation: Presentation): Date | null {
    const sortedSlots = sortSlots(presentation.slots);
    const firstSlot = sortedSlots[0];

    if (firstSlot) {
        const slotDate = new Date(firstSlot.startAt);
        if (!Number.isNaN(slotDate.getTime())) {
            return slotDate;
        }
    }

    const date = new Date(presentation.date);
    return Number.isNaN(date.getTime()) ? null : date;
}

export function getPresentationTimeRangeLabel(presentation: Presentation): string {
    const sortedSlots = sortSlots(presentation.slots);
    if (sortedSlots.length === 0) {
        return "時間未設定";
    }

    const first = new Date(sortedSlots[0].startAt);
    const last = new Date(sortedSlots[sortedSlots.length - 1].endAt);
    if (Number.isNaN(first.getTime()) || Number.isNaN(last.getTime())) {
        return "時間未設定";
    }

    const start = `${String(first.getHours()).padStart(2, "0")}:${String(first.getMinutes()).padStart(2, "0")}`;
    const end = `${String(last.getHours()).padStart(2, "0")}:${String(last.getMinutes()).padStart(2, "0")}`;
    return `${start} - ${end}`;
}

export function sortSlots(slots: PresentationSlot[]): PresentationSlot[] {
    return [...slots].sort((left, right) => new Date(left.startAt).getTime() - new Date(right.startAt).getTime());
}

export function buildCalendarDays(baseMonth: Date): Array<{ date: Date; key: string; inMonth: boolean }> {
    const firstDay = new Date(baseMonth.getFullYear(), baseMonth.getMonth(), 1);
    const start = new Date(firstDay);
    start.setDate(firstDay.getDate() - firstDay.getDay());

    return Array.from({ length: 42 }, (_, index) => {
        const date = new Date(start);
        date.setDate(start.getDate() + index);
        return {
            date,
            key: toDateKey(date),
            inMonth: date.getMonth() === baseMonth.getMonth(),
        };
    });
}