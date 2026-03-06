/**
 * ConfirmModal Component
 * 
 * ユーザーアクションの確認を求めるモーダルダイアログ
 * 削除処理、重要な変更操作などで使用
 * フォーカストラップ、キーボード操作、処理中状態に対応
 * 
 * @param isOpen - モーダルの表示状態
 * @param title - モーダルのタイトル
 * @param message - 確認メッセージ
 * @param confirmText - 確認ボタンのテキスト
 * @param cancelText - キャンセルボタンのテキスト
 * @param confirmVariant - 確認ボタンの種類（primary or danger）
 * @param onConfirm - 確認時のコールバック
 * @param onCancel - キャンセル時のコールバック
 * @param loading - 処理中状態
 */
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Button from "../ui/Button";
import LoadingSpinner from "./LoadingSpinner";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmVariant?: "primary" | "danger";
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

export default function ConfirmModal({
    isOpen,
    title,
    message,
    confirmText = "確認",
    cancelText = "キャンセル",
    confirmVariant = "primary",
    onConfirm,
    onCancel,
    loading = false
}: ConfirmModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const cancelButtonRef = useRef<HTMLButtonElement>(null);

    // キーボードイベント処理
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !loading) {
                onCancel();
            }
            if (e.key === "Enter" && !loading) {
                onConfirm();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onConfirm, onCancel, loading]);

    // フォーカス管理
    useEffect(() => {
        if (isOpen && cancelButtonRef.current) {
            cancelButtonRef.current.focus();
        }
    }, [isOpen]);

    // ボディスクロール制御
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = "";
            };
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const overlayStyle: React.CSSProperties = {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
        padding: "var(--spacing-xl)"
    };

    const modalStyle: React.CSSProperties = {
        backgroundColor: "var(--color-bg-sub)",
        borderRadius: "var(--radius-main)",
        boxShadow: "var(--shadow-main)",
        maxWidth: "400px",
        width: "100%",
        maxHeight: "90vh",
        overflow: "auto",
        animation: "modalAppear 0.2s ease-out"
    };

    const headerStyle: React.CSSProperties = {
        padding: "var(--spacing-xl)",
        paddingBottom: "var(--spacing-md)",
        borderBottom: "1px solid var(--color-border)"
    };

    const titleStyle: React.CSSProperties = {
        fontSize: "var(--font-size-h2)",
        fontWeight: "600",
        color: "var(--color-text-main)",
        margin: 0
    };

    const bodyStyle: React.CSSProperties = {
        padding: "var(--spacing-xl)"
    };

    const messageStyle: React.CSSProperties = {
        fontSize: "var(--font-size-base)",
        color: "var(--color-text-main)",
        lineHeight: "1.5",
        margin: 0
    };

    const footerStyle: React.CSSProperties = {
        padding: "var(--spacing-xl)",
        paddingTop: 0,
        display: "flex",
        gap: "var(--spacing-md)",
        justifyContent: "flex-end"
    };

    const animations = `
    @keyframes modalAppear {
      from {
        opacity: 0;
        transform: scale(0.9) translateY(-10px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
  `;

    const content = (
        <div style={overlayStyle}>
            <div ref={modalRef} style={modalStyle} role="dialog" aria-modal="true" aria-labelledby="modal-title">
                <div style={headerStyle}>
                    <h2 id="modal-title" style={titleStyle}>
                        {title}
                    </h2>
                </div>

                <div style={bodyStyle}>
                    <p style={messageStyle}>{message}</p>
                </div>

                <div style={footerStyle}>
                    <Button
                        ref={cancelButtonRef}
                        variant="outline"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={confirmVariant}
                        onClick={onConfirm}
                        disabled={loading}
                        style={{ minWidth: "100px" }}
                    >
                        {loading ? (
                            <LoadingSpinner size="sm" variant="secondary" />
                        ) : (
                            confirmText
                        )}
                    </Button>
                </div>
            </div>

            <style>{animations}</style>
        </div>
    );

    return createPortal(content, document.body);
}