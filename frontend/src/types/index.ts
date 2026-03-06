// Firebase Auth関連の型定義
export interface AuthUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
}

// アプリケーションユーザー型
export interface User {
    name: string;
    email: string;
    role: "student" | "professor" | "admin";
    createdAt?: any; // FirebaseのTimestampは複雑なので一旦保持
}

// 投稿関連の型
export interface PostData {
    title: string;
    content: string;
    uid: string;
    authorName: string;
}

export interface Post extends PostData {
    id: string;
    createdAt: any; // FirebaseのTimestampは複雑なので一旦保持
}

// エラー関連の型
export interface FirebaseError {
    code: string;
    message: string;
    name: string;
}

// アプリケーション共通エラー型
export enum ErrorTypes {
    AUTH_ERROR = "AUTH_ERROR",
    FIRESTORE_ERROR = "FIRESTORE_ERROR",
    NETWORK_ERROR = "NETWORK_ERROR",
    VALIDATION_ERROR = "VALIDATION_ERROR",
    UNKNOWN_ERROR = "UNKNOWN_ERROR"
}

export interface AppError {
    type: ErrorTypes;
    code: string;
    message: string;
    originalError?: unknown;
    timestamp: Date;
}

// ページナビゲーション型
export type PageType = 'dashboard' | 'presentation' | 'events' | 'blog' | 'settings';

// プロップス型
export interface AppLayoutProps {
    currentPage: PageType;
    onNavigate: (page: PageType) => void;
    user?: AuthUser;
    isAdmin: boolean;
    onSignOut: () => Promise<void>;
    children: React.ReactNode;
}

// 共通のAPI応答型
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: AppError;
}