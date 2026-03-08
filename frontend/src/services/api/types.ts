export type ApiError = {
    code: string;
    message: string;
};

export type ApiResponse<T> = {
    ok: boolean;
    data?: T;
    error?: ApiError;
};
