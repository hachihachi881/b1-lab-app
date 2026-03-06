// エラーハンドリングとAPI応答の統一管理

import { FirebaseError, AppError, ApiResponse, ErrorTypes } from "../types";

// Firebase認証エラーの日本語化マップ
const AUTH_ERROR_MESSAGES: Record<string, string> = {
    "auth/user-not-found": "メールアドレスまたはパスワードが正しくありません",
    "auth/wrong-password": "メールアドレスまたはパスワードが正しくありません",
    "auth/invalid-email": "有効なメールアドレスを入力してください",
    "auth/user-disabled": "このアカウントは無効になっています",
    "auth/too-many-requests": "ログイン試行回数が上限に達しました。しばらく待ってからお試しください",
    "auth/network-request-failed": "ネットワークエラーが発生しました。接続を確認してください",
    "auth/email-already-in-use": "このメールアドレスは既に使用されています",
    "auth/weak-password": "パスワードは6文字以上で入力してください",
    "auth/requires-recent-login": "セキュリティのため、再度ログインしてください"
};

// Firestore関連エラーメッセージ
const FIRESTORE_ERROR_MESSAGES: Record<string, string> = {
    "permission-denied": "この操作を実行する権限がありません",
    "not-found": "指定されたデータが見つかりません",
    "already-exists": "データが既に存在しています",
    "resource-exhausted": "操作の制限に達しました。しばらく待ってからお試しください",
    "unauthenticated": "認証が必要です。ログインしてください",
    "unavailable": "サービスが一時的に利用できません"
};

// エラー分類関数
export function classifyError(error: unknown): AppError {
    const timestamp = new Date();

    // Firebase認証エラー
    if (isFirebaseAuthError(error)) {
        return {
            type: ErrorTypes.AUTH_ERROR,
            code: error.code,
            message: AUTH_ERROR_MESSAGES[error.code] || "認証エラーが発生しました",
            originalError: error,
            timestamp
        };
    }

    // Firestore関連エラー
    if (isFirestoreError(error)) {
        return {
            type: ErrorTypes.FIRESTORE_ERROR,
            code: error.code,
            message: FIRESTORE_ERROR_MESSAGES[error.code] || "データベースエラーが発生しました",
            originalError: error,
            timestamp
        };
    }

    // ネットワークエラー
    if (isNetworkError(error)) {
        return {
            type: ErrorTypes.NETWORK_ERROR,
            code: "network-error",
            message: "ネットワークに接続できません。インターネット接続を確認してください",
            originalError: error,
            timestamp
        };
    }

    // 未知のエラー
    return {
        type: ErrorTypes.UNKNOWN_ERROR,
        code: "unknown",
        message: "予期しないエラーが発生しました",
        originalError: error,
        timestamp
    };
}

// Firebase認証エラーの判定
function isFirebaseAuthError(error: unknown): error is FirebaseError {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        typeof (error as any).code === "string" &&
        (error as any).code.startsWith("auth/")
    );
}

// Firestoreエラーの判定
function isFirestoreError(error: unknown): error is FirebaseError {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        typeof (error as any).code === "string" &&
        !((error as any).code.startsWith("auth/"))
    );
}

// ネットワークエラーの判定
function isNetworkError(error: unknown): boolean {
    if (typeof error === "object" && error !== null) {
        const err = error as any;
        return (
            err.code === "auth/network-request-failed" ||
            err.message?.includes("network") ||
            err.name === "NetworkError"
        );
    }
    return false;
}

// API呼び出しラッパー関数
export async function safeApiCall<T>(
    operation: () => Promise<T>,
    context?: string
): Promise<ApiResponse<T>> {
    try {
        const data = await operation();
        return { success: true, data };
    } catch (error) {
        const appError = classifyError(error);

        // コンソールログ
        console.group(`API Error${context ? ` (${context})` : ''}`);
        console.error("Classified Error:", appError);
        console.error("Original Error:", error);
        console.groupEnd();

        return { success: false, error: appError };
    }
}

// ユーザー向けエラー表示関数
export function showErrorToUser(error: AppError): void {
    // より良いユーザーエクスペリエンスのため、alertの代わりにトーストやモーダルを使用することを推奨
    alert(`エラー: ${error.message}`);
}

// ログサービス（将来の拡張用）
export function logError(error: AppError, context?: string): void {
    // 将来的にはFirebase Analytics、Sentryなどの外部ログサービスに送信
    console.error("Error logged:", {
        context,
        ...error
    });
}