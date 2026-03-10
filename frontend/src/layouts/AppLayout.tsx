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
import React, { ReactNode, useEffect, useState, useRef } from "react";
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
  onSignOut?: () => void;
  loginMode?: boolean;
}

function Navbar({
  currentPage,
  onNavigate,
  user,
  isAdmin,
  onSignOut,
  loginMode
}: {
  currentPage?: PageType;
  onNavigate?: (page: PageType) => void;
  user?: AuthUser;
  isAdmin?: boolean;
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

  // ドロップダウンメニュー管理
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const addMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // ドロップダウンメニューの位置調整
  const adjustDropdownPosition = (menuRef: React.RefObject<HTMLDivElement>, isUserMenu = false) => {
    if (!menuRef.current) return;

    const menu = menuRef.current;
    const dropdown = menu.querySelector('.dropdown-menu') as HTMLElement;
    if (!dropdown) return;

    // メニューを一時的に表示してサイズを測定
    dropdown.style.visibility = 'hidden';
    dropdown.style.display = 'block';

    const dropdownRect = dropdown.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    if (isUserMenu) {
      // ユーザーメニューは常に右寄せ（アカウント専用クラスを使用）
      dropdown.classList.add('dropdown-menu--account');
      dropdown.classList.remove('dropdown-menu--right');
    } else {
      // 予定追加メニューは画面右端からはみ出る場合のみ右寄せ
      if (dropdownRect.right > viewportWidth - 20) {
        dropdown.classList.add('dropdown-menu--right');
      } else {
        dropdown.classList.remove('dropdown-menu--right');
      }
    }

    dropdown.style.visibility = 'visible';
  };

  // ドロップダウンメニューの外側クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(event.target as Node)) {
        setIsAddMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ドロップダウンが開いた時の位置調整
  useEffect(() => {
    if (isAddMenuOpen) {
      adjustDropdownPosition(addMenuRef, false);
    }
  }, [isAddMenuOpen]);

  useEffect(() => {
    if (isUserMenuOpen) {
      adjustDropdownPosition(userMenuRef, true);
    }
  }, [isUserMenuOpen]);

  // 予定追加ドロップダウンメニューの項目
  const addMenuItems = [
    { label: 'お茶会ブログ', page: 'blog' as PageType },
    { label: '発表', page: 'presentation' as PageType },
    { label: 'イベント', page: 'events' as PageType },
  ];

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
          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-md)" }}>
            {/* 天気・日時表示: 全ログイン済みユーザーに表示 */}
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

            {/* 新規投稿ボタン: 権限を持つユーザーのみ */}
            {user && isAdmin && (
              <div className="dropdown" ref={addMenuRef}>
                <button
                  className="add-button"
                  onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                  aria-label="予定を追加"
                >
                  <span className="plus-icon">＋</span>
                  <span className="chevron-icon">▼</span>
                </button>

                {isAddMenuOpen && (
                  <div className="dropdown-menu">
                    {addMenuItems.map((item) => (
                      <button
                        key={item.page}
                        className="dropdown-item"
                        onClick={() => {
                          onNavigate?.(item.page);
                          setIsAddMenuOpen(false);
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* アカウントアイコン: 全ログイン済みユーザーに表示 */}
            <div className="dropdown" ref={userMenuRef}>
              <button
                className="avatar-button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                aria-label="ユーザーメニュー"
              >
                <span className="avatar-icon">👤</span>
              </button>

              {isUserMenuOpen && (
                <div className="dropdown-menu dropdown-menu--account">
                  <div className="dropdown-user-info">
                    {user?.email}
                  </div>
                  <button
                    className="dropdown-item dropdown-item--danger"
                    onClick={() => {
                      onSignOut?.();
                      setIsUserMenuOpen(false);
                    }}
                  >
                    ログアウト
                  </button>
                </div>
              )}
            </div>
          </div>
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
        onSignOut={onSignOut}
        loginMode={loginMode}
      />
      <main className={loginMode ? "" : "page-container"} style={{ minHeight: "calc(100vh - 60px)" }}>
        {children}
      </main>
    </div>
  );
}