/**
 * DatePicker Component
 * 
 * 日付・時刻選択用のコンポーネント
 * HTML5のdate/datetime-local inputをベースに、統一されたデザインで提供
 * お茶会やイベントの日程設定などで使用
 * 
 * @param value - ISO文字列形式の日付・時刻 "2024-03-06T14:30"
 * @param onChange - 値変更時のコールバック
 * @param label - 入力フィールドのラベル
 * @param placeholder - プレースホルダーテキスト
 * @param required - 必須入力かどうか
 * @param disabled - 無効状態かどうか
 * @param error - エラーメッセージ
 * @param includeTime - 時間も選択するか（デフォルト: false）
 * @param hint - ヘルプテキスト
 */
import React, { useId } from "react";

interface DatePickerProps {
    value?: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    includeTime?: boolean;
    hint?: string;
    min?: string; // 最小日時
    max?: string; // 最大日時
    className?: string;
    style?: React.CSSProperties;
}

export default function DatePicker({
    value = "",
    onChange,
    label,
    placeholder,
    required = false,
    disabled = false,
    error,
    includeTime = false,
    hint,
    min,
    max,
    className = "",
    style = {}
}: DatePickerProps) {
    const id = useId();
    const hasError = Boolean(error);
    const inputType = includeTime ? "datetime-local" : "date";

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
        boxSizing: "border-box",
        fontFamily: "inherit"
    };

    const focusStyle = `
    input[type="date"]:focus,
    input[type="datetime-local"]:focus {
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
        onChange(newValue);
    };

    // ISO文字列をinputの値形式に変換
    const getInputValue = () => {
        if (!value) return "";

        try {
            const date = new Date(value);
            if (includeTime) {
                // datetime-local形式: YYYY-MM-DDTHH:mm
                return date.toISOString().slice(0, 16);
            } else {
                // date形式: YYYY-MM-DD
                return date.toISOString().slice(0, 10);
            }
        } catch (error) {
            return "";
        }
    };

    // 日付フォーマットのヒント表示
    const getFormatHint = () => {
        if (hint) return hint;
        if (includeTime) {
            return "日付と時刻を選択してください";
        } else {
            return "日付を選択してください";
        }
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
                type={inputType}
                value={getInputValue()}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={disabled}
                min={min}
                max={max}
                style={inputStyle}
                aria-describedby={
                    error ? `${id}-error` : hint || getFormatHint() ? `${id}-hint` : undefined
                }
            />

            {error && (
                <p id={`${id}-error`} style={errorStyle} role="alert">
                    {error}
                </p>
            )}

            {!error && (hint || !hint) && (
                <p id={`${id}-hint`} style={hintStyle}>
                    {getFormatHint()}
                </p>
            )}

            <style>{focusStyle}</style>
        </div>
    );
}