/**
 * AppLayout Component
 * 
 * アプリケーション全体のレイアウトを制御するメインコンポーネント
 * ナビゲーションバー、ユーザー情報、管理者機能ボタンなど
 * 共通のUI要素を提供し、各ページのコンテンツをラップします。
 * 
 * @param children - ページのメインコンテンツ
 * @param currentPage - 現在のアクティブページ
 * @param onNavigate - ページ遷移時のイベントハンドラー
 * @param user - ログイン中ユーザー情報
 * @param isAdmin - 管理者権限の有無
 * @param onSignOut - サインアウト時のイベントハンドラー
 */
import React, { ReactNode } from "react";
import Button from "../components/common/Button";

interface AppLayoutProps {
    children: ReactNode;
    currentPage?: string;
    onNavigate?: (page: string) => void;
    user?: any;
    isAdmin?: boolean;
    onAddSchedule?: () => void;
    onSignOut?: () => void;
}

function Navbar({
    currentPage,
    onNavigate,
    user,
    isAdmin,
    onAddSchedule,
    onSignOut
}: {
    currentPage?: string;
    onNavigate?: (page: string) => void;
    user?: any;
    isAdmin?: boolean;
    onAddSchedule?: () => void;
    onSignOut?: () => void;
}) {
    return (
        <nav className="navbar">
            <div className="navbar__links">
                <h2 
                    className="navbar__brand" 
                    onClick={() => onNavigate?.('dashboard')}
                    style={{ cursor: 'pointer' }}
                >
                    B1LabApp
                </h2>
                <a
                    href="#"
                    className={`navbar__item ${currentPage === 'dashboard' ? 'navbar__item--active' : ''}`}
                    onClick={(e) => { e.preventDefault(); onNavigate?.('dashboard'); }}
                >
                    ダッシュボード
                </a>
                <a
                    href="#"
                    className={`navbar__item ${currentPage === 'presentation' ? 'navbar__item--active' : ''}`}
                    onClick={(e) => { e.preventDefault(); onNavigate?.('presentation'); }}
                >
                    発表
                </a>
                <a
                    href="#"
                    className={`navbar__item ${currentPage === 'events' ? 'navbar__item--active' : ''}`}
                    onClick={(e) => { e.preventDefault(); onNavigate?.('events'); }}
                >
                    イベント
                </a>
                <a
                    href="#"
                    className={`navbar__item ${currentPage === 'blog' ? 'navbar__item--active' : ''}`}
                    onClick={(e) => { e.preventDefault(); onNavigate?.('blog'); }}
                >
                    お茶会ブログ
                </a>
                <a
                    href="#"
                    className={`navbar__item ${currentPage === 'settings' ? 'navbar__item--active' : ''}`}
                    onClick={(e) => { e.preventDefault(); onNavigate?.('settings'); }}
                >
                    設定
                </a>
            </div>
            <div className="navbar__links">
                {user && isAdmin && (
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-md)" }}>
                        <div style={{ display: "flex", alignItems: "center", fontSize: "var(--font-size-sm)" }}>
                            👤 {user.email}
                        </div>
                        <Button onClick={onAddSchedule} variant="primary" size="sm">
                            ＋ 予定を追加
                        </Button>
                        <Button onClick={onSignOut} variant="danger" size="sm">
                            ログアウト
                        </Button>
                    </div>
                )}
                <div className="weather-widget">
                    {/* 天気と日時の表示（外部APIと連携する予定） */}
                    <span>☁️ 13℃ 徳島</span>
                    <span style={{ marginLeft: 12, borderLeft: "1px solid #ccc", paddingLeft: 12 }}>
                        2月28日(土) 14:09
                    </span>
                </div>
            </div>
        </nav>
    );
}

export default function AppLayout({
    children,
    currentPage,
    onNavigate,
    user,
    isAdmin,
    onAddSchedule,
    onSignOut
}: AppLayoutProps) {
    return (
        <div>
            <Navbar
                currentPage={currentPage}
                onNavigate={onNavigate}
                user={user}
                isAdmin={isAdmin}
                onAddSchedule={onAddSchedule}
                onSignOut={onSignOut}
            />
            <main className="page-container" style={{ minHeight: "calc(100vh - 60px)" }}>
                {children}
            </main>
        </div>
    );
}