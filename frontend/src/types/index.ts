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
    error?: string;
}