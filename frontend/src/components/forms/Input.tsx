/**
 * Input Component
 * 
 * フォーム入力用の統一されたテキスト入力コンポーネント
 * エラー表示、ヘルプテキスト、バリデーション機能を含む
 * デザインシステムに準拠したスタイリング
 * 
 * @param label - 入力フィールドのラベル
 * @param value - 入力値
 * @param onChange - 値変更時のコールバック
 * @param type - 入力タイプ（text, email, password, number）
 * @param placeholder - プレースホルダーテキスト
 * @param required - 必須入力かどうか
 * @param disabled - 無効状態かどうか
 * @param error - エラーメッセージ
 * @param hint - ヘルプテキスト
 * @param maxLength - 最大文字数
 */
import React, { useId } from "react";

interface InputProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    type?: "text" | "email" | "password" | "number";
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    hint?: string;
    maxLength?: number;
    className?: string;
    style?: React.CSSProperties;
}

export default function Input({
    label,
    value,
    onChange,
    type = "text",
    placeholder,
    required = false,
    disabled = false,
    error,
    hint,
    maxLength,
    className = "",
    style = {}
}: InputProps) {
    const id = useId();
    const hasError = Boolean(error);

    const containerStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-xs)",
        width: "100%",
        ...style
    };

    const labelStyle: React.CSSProperties = {
        fontSize: "var(--font-size-sm)",
        fontWeight: "600",
        color: "var(--color-text-main)",
        margin: 0
    };

    const inputStyle: React.CSSProperties = {
        padding: "var(--spacing-md)",
        fontSize: "var(--font-size-base)",
        borderRadius: "var(--radius-button)",
        border: `1px solid ${hasError ? "var(--color-danger)" : "var(--color-border)"}`,
        backgroundColor: disabled ? "var(--color-bg-main)" : "var(--color-bg-sub)",
        color: disabled ? "var(--color-text-sub)" : "var(--color-text-main)",
        transition: "border-color 0.2s, box-shadow 0.2s",
        outline: "none",
        width: "100%",
        boxSizing: "border-box"
    };

    const focusStyle = `
    input:focus {
      border-color: ${hasError ? "var(--color-danger)" : "var(--color-primary)"};
      box-shadow: 0 0 0 3px ${hasError ? "rgba(239, 68, 68, 0.1)" : "rgba(59, 130, 246, 0.1)"};
    }
  `;

    const errorStyle: React.CSSProperties = {
        fontSize: "var(--font-size-sm)",
        color: "var(--color-danger)",
        margin: 0
    };

    const hintStyle: React.CSSProperties = {
        fontSize: "var(--font-size-sm)",
        color: "var(--color-text-sub)",
        margin: 0
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (maxLength && newValue.length > maxLength) return;
        onChange(newValue);
    };

    return (
        <div className={className} style={containerStyle}>
            {label && (
                <label htmlFor={id} style={labelStyle}>
                    {label}
                    {required && (
                        <span style={{ color: "var(--color-danger)", marginLeft: "2px" }}>*</span>
                    )}
                </label>
            )}

            <input
                id={id}
                type={type}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={disabled}
                maxLength={maxLength}
                style={inputStyle}
                aria-describedby={
                    error ? `${id}-error` : hint ? `${id}-hint` : undefined
                }
            />

            {error && (
                <p id={`${id}-error`} style={errorStyle} role="alert">
                    {error}
                </p>
            )}

            {hint && !error && (
                <p id={`${id}-hint`} style={hintStyle}>
                    {hint}
                </p>
            )}

            <style>{focusStyle}</style>
        </div>
    );
}