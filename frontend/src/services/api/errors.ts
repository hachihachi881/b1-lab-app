import { ApiError } from "./types";

export const toApiError = (error: unknown): ApiError => {
    if (typeof error === "object" && error !== null && "message" in error) {
        return {
            code: "unknown",
            message: String((error as { message?: unknown }).message ?? "Unexpected error"),
        };
    }

    return {
        code: "unknown",
        message: "Unexpected error",
    };
};
