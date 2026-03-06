/**
 * Toast Component
 * 
 * 成功・エラー・情報・警告メッセージを一時的に表示するコンポーネント
 * 画面右上に表示され、自動で消える（またはユーザーが×で閉じる）
 * スライドインアニメーション付き
 * 
 * @param type - トーストの種類（success, error, info, warning）
 * @param message - 表示するメッセージ
 * @param duration - 自動で消える時間（ms）
 * @param onClose - 閉じるときのコールバック
 */
import React, { useEffect, useState } from "react";

interface ToastProps {
    type: "success" | "error" | "info" | "warning";
    message: string;
    duration?: number;
    onClose?: () => void;
}

export default function Toast({
    type,
    message,
    duration = 5000,
    onClose
}: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);

    // マウント時にスライドイン
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // 自動で閉じる
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                handleClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose?.();
        }, 300); // アニメーション完了を待つ
    };

    const getTypeStyles = () => {
        const baseStyles = {
            backgroundColor: "var(--color-bg-sub)",
            borderLeft: "4px solid"
        };

        switch (type) {
            case "success":
                return {
                    ...baseStyles,
                    borderLeftColor: "var(--color-status-done)",
                    color: "var(--color-text-main)"
                };
            case "error":
                return {
                    ...baseStyles,
                    borderLeftColor: "var(--color-danger)",
                    color: "var(--color-text-main)"
                };
            case "warning":
                return {
                    ...baseStyles,
                    borderLeftColor: "var(--color-status-pending)",
                    color: "var(--color-text-main)"
                };
            case "info":
                return {
                    ...baseStyles,
                    borderLeftColor: "var(--color-primary)",
                    color: "var(--color-text-main)"
                };
            default:
                return baseStyles;
        }
    };

    const getIcon = () => {
        switch (type) {
            case "success":
                return "✓";
            case "error":
                return "⚠";
            case "warning":
                return "⚠";
            case "info":
                return "ℹ";
            default:
                return "";
        }
    };

    const toastStyle: React.CSSProperties = {
        ...getTypeStyles(),
        padding: "var(--spacing-md)",
        borderRadius: "var(--radius-button)",
        boxShadow: "var(--shadow-main)",
        display: "flex",
        alignItems: "center",
        gap: "var(--spacing-sm)",
        maxWidth: "400px",
        minWidth: "300px",
        fontSize: "var(--font-size-sm)",
        position: "relative",
        transform: isVisible ? "translateX(0)" : "translateX(100%)",
        opacity: isVisible ? 1 : 0,
        transition: "all 0.3s ease-out"
    };

    const iconStyle: React.CSSProperties = {
        fontSize: "16px",
        fontWeight: "bold",
        flexShrink: 0
    };

    const messageStyle: React.CSSProperties = {
        flex: 1,
        margin: 0
    };

    const closeButtonStyle: React.CSSProperties = {
        background: "none",
        border: "none",
        fontSize: "16px",
        cursor: "pointer",
        padding: "0",
        color: "var(--color-text-sub)",
        flexShrink: 0,
        lineHeight: 1
    };

    return (
        <div style={toastStyle}>
            <span style={iconStyle}>{getIcon()}</span>
            <p style={messageStyle}>{message}</p>
            <button
                onClick={handleClose}
                style={closeButtonStyle}
                aria-label="閉じる"
            >
                ×
            </button>
        </div>
    );
}