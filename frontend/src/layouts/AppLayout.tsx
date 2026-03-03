import React, { ReactNode } from "react";

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
            <div className="nav-links">
                <h2 style={{ color: "#3b82f6", marginRight: 24 }}>🧪 B1LabApp</h2>
                <a
                    href="#"
                    className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); onNavigate?.('dashboard'); }}
                >
                    ダッシュボード
                </a>
                <a
                    href="#"
                    className={`nav-item ${currentPage === 'presentation' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); onNavigate?.('presentation'); }}
                >
                    発表スケジューラー
                </a>
                <a
                    href="#"
                    className={`nav-item ${currentPage === 'events' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); onNavigate?.('events'); }}
                >
                    イベント
                </a>
                <a
                    href="#"
                    className={`nav-item ${currentPage === 'blog' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); onNavigate?.('blog'); }}
                >
                    お茶会ブログ
                </a>
                <a
                    href="#"
                    className={`nav-item ${currentPage === 'settings' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); onNavigate?.('settings'); }}
                >
                    設定
                </a>
            </div>
            <div className="nav-links">
                {user && isAdmin && (
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ display: "flex", alignItems: "center", fontSize: 14 }}>
                            👤 {user.email}
                        </div>
                        <button onClick={onAddSchedule}>
                            ＋ 予定を追加
                        </button>
                        <button
                            onClick={onSignOut}
                            style={{ background: "#ef4444" }}
                        >
                            ログアウト
                        </button>
                    </div>
                )}
                <div className="weather-widget">
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
            <div style={{ background: "#f4f6f9", minHeight: "calc(100vh - 60px)" }}>
                {children}
            </div>
        </div>
    );
}