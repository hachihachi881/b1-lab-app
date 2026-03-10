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
import React, { ReactNode, useEffect, useState } from "react";
import Button from "../components/ui/Button";
import { AuthUser, PageType } from "../types";

const WEEKDAYS_JA = ["日", "月", "火", "水", "木", "金", "土"];

function formatDateTimeJa(date: Date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = WEEKDAYS_JA[date.getDay()];
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return {
    dateText: `${month}月${day}日(${weekday})`,
    hours,
    minutes
  };
}

interface AppLayoutProps {
  children: ReactNode;
  currentPage?: PageType;
  onNavigate?: (page: PageType) => void;
  user?: AuthUser;
  isAdmin?: boolean;
  onAddSchedule?: () => void;
  onSignOut?: () => void;
  loginMode?: boolean;
}

function Navbar({
  currentPage,
  onNavigate,
  user,
  isAdmin,
  onAddSchedule,
  onSignOut,
  loginMode
}: {
  currentPage?: PageType;
  onNavigate?: (page: PageType) => void;
  user?: AuthUser;
  isAdmin?: boolean;
  onAddSchedule?: () => void;
  onSignOut?: () => void;
  loginMode?: boolean;
}) {
  const [now, setNow] = useState(new Date());
  const [isColonVisible, setIsColonVisible] = useState(true);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const blinkTimer = window.setInterval(() => {
      setIsColonVisible((prev) => !prev);
    }, 1000);

    return () => {
      window.clearInterval(blinkTimer);
    };
  }, []);

  const formattedDateTime = formatDateTimeJa(now);

  return (
    <nav className="navbar">
      <div className="navbar__links">
        <h2
          className="navbar__brand"
          onClick={() => !loginMode && onNavigate?.('dashboard')}
          style={{ cursor: loginMode ? 'default' : 'pointer' }}
        >
          B1LabApp
        </h2>
        {!loginMode && (
          <>
            <a
              href="#"
              className={`navbar__item ${currentPage === 'blog' ? 'navbar__item--active' : ''}`}
              onClick={(e) => { e.preventDefault(); onNavigate?.('blog'); }}
            >
              お茶会ブログ
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
              className={`navbar__item ${currentPage === 'settings' ? 'navbar__item--active' : ''}`}
              onClick={(e) => { e.preventDefault(); onNavigate?.('settings'); }}
            >
              設定
            </a>
          </>
        )}
      </div>
      <div className="navbar__links">
        {!loginMode && (
          <>
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
              {/* 日付と時間の表示 */}
              <span style={{ marginLeft: 12, borderLeft: "1px solid #ccc", paddingLeft: 12 }}>
                {formattedDateTime.dateText} {formattedDateTime.hours}
                <span
                  style={{
                    opacity: isColonVisible ? 1 : 0
                  }}
                >
                  :
                </span>
                {formattedDateTime.minutes}
              </span>
            </div>
          </>
        )}
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
  onSignOut,
  loginMode
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
        loginMode={loginMode}
      />
      <main className={loginMode ? "" : "page-container"} style={{ minHeight: "calc(100vh - 60px)" }}>
        {children}
      </main>
    </div>
  );
}