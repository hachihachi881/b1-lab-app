export type ApiErrorCode =
    | "unauthenticated"
    | "permissionDenied"
    | "invalidArgument"
    | "notFound"
    | "internal";

export class ApiError extends Error {
    constructor(public readonly code: ApiErrorCode, message: string) {
        super(message);
        this.name = "ApiError";
    }
}
