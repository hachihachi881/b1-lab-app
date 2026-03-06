/**
 * Toast Context & Provider
 * 
 * アプリケーション全体でToast通知を管理するContext
 * 複数のToastをキューで管理し、画面右上に順次表示
 * Portalを使用して画面の最上位に表示
 * 
 * showToast関数を通じて他のコンポーネントからToastを表示可能
 */
import React, { createContext, useContext, useState, ReactNode } from "react";
import { createPortal } from "react-dom";
import Toast from "./Toast";

interface ToastItem {
    id: string;
    type: "success" | "error" | "info" | "warning";
    message: string;
    duration?: number;
}

interface ToastContextProps {
    showToast: (type: ToastItem['type'], message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

interface ToastProviderProps {
    children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const showToast = (type: ToastItem['type'], message: string, duration?: number) => {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const newToast: ToastItem = {
            id,
            type,
            message,
            duration
        };

        setToasts(prev => [...prev, newToast]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const containerStyle: React.CSSProperties = {
        position: "fixed",
        top: "var(--spacing-xl)",
        right: "var(--spacing-xl)",
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-md)",
        pointerEvents: "none"
    };

    const toastElements = toasts.map((toast, index) => (
        <div
            key={toast.id}
            style={{
                pointerEvents: "auto",
                transform: `translateY(${index * 8}px)`,
                transition: "transform 0.3s ease-out"
            }}
        >
            <Toast
                type={toast.type}
                message={toast.message}
                duration={toast.duration}
                onClose={() => removeToast(toast.id)}
            />
        </div>
    ));

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toasts.length > 0 &&
                createPortal(
                    <div style={containerStyle}>
                        {toastElements}
                    </div>,
                    document.body
                )}
        </ToastContext.Provider>
    );
}

export function useToast(): ToastContextProps {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}