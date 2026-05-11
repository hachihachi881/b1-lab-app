import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Button from "../ui/Button";
import Input from "../forms/Input";
import TextArea from "../forms/TextArea";
import DatePicker from "../forms/DatePicker";
import LoadingSpinner from "../feedback/LoadingSpinner";
import { TeaParty } from "../../services/teaParties/teaPartiesService";

type FormData = Omit<TeaParty, "id">;
type FormErrors = Partial<Record<keyof FormData, string>>;

const EMPTY: FormData = { title: "", date: "", body: "", nextDate: undefined };

interface TeaPartyFormModalProps {
    isOpen: boolean;
    editTarget: TeaParty | null;
    loading: boolean;
    onSubmit: (data: FormData) => void;
    onCancel: () => void;
}

export default function TeaPartyFormModal({
    isOpen,
    editTarget,
    loading,
    onSubmit,
    onCancel
}: TeaPartyFormModalProps) {
    const [form, setForm] = useState<FormData>(EMPTY);
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (!isOpen) return;
        setForm(editTarget ? { ...editTarget } : EMPTY);
        setErrors({});
    }, [isOpen, editTarget]);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !loading) onCancel();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [isOpen, loading, onCancel]);

    useEffect(() => {
        if (!isOpen) return;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    const validate = (): boolean => {
        const e: FormErrors = {};
        if (!form.title.trim()) e.title = "タイトルを入力してください";
        if (!form.date) e.date = "開催日を選択してください";
        if (!form.body.trim()) e.body = "内容を入力してください";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = () => {
        if (!validate() || loading) return;
        onSubmit({
            title: form.title.trim(),
            date: form.date,
            body: form.body.trim(),
            nextDate: form.nextDate || undefined,
        });
    };

    if (!isOpen) return null;

    const content = (
        <div
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10000,
                padding: "var(--spacing-xl)"
            }}
            onClick={(e) => { if (e.target === e.currentTarget && !loading) onCancel(); }}
        >
            <div
                style={{
                    backgroundColor: "var(--color-bg-sub)",
                    borderRadius: "var(--radius-main)",
                    boxShadow: "var(--shadow-main)",
                    width: "100%",
                    maxWidth: "540px",
                    maxHeight: "90vh",
                    overflow: "auto",
                    animation: "modalAppear 0.2s ease-out"
                }}
                role="dialog"
                aria-modal="true"
                aria-labelledby="tea-party-form-title"
            >
                <div style={{
                    padding: "var(--spacing-xl)",
                    paddingBottom: "var(--spacing-md)",
                    borderBottom: "1px solid var(--color-border)"
                }}>
                    <h2
                        id="tea-party-form-title"
                        style={{
                            fontSize: "var(--font-size-h2)",
                            fontWeight: "600",
                            margin: 0,
                            color: "var(--color-text-main)"
                        }}
                    >
                        {editTarget ? "お茶会ブログを編集" : "お茶会ブログを作成"}
                    </h2>
                </div>

                <div style={{
                    padding: "var(--spacing-xl)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--spacing-lg)"
                }}>
                    <Input
                        label="タイトル"
                        value={form.title}
                        onChange={(v) => setForm((f) => ({ ...f, title: v }))}
                        placeholder="例: 第15回お茶会"
                        required
                        error={errors.title}
                        maxLength={100}
                    />
                    <DatePicker
                        label="開催日"
                        value={form.date}
                        onChange={(v) => setForm((f) => ({ ...f, date: v }))}
                        required
                        error={errors.date}
                    />
                    <DatePicker
                        label="次回予定日（任意）"
                        value={form.nextDate ?? ""}
                        onChange={(v) => setForm((f) => ({ ...f, nextDate: v || undefined }))}
                        hint="次回のお茶会が決まっている場合に入力してください"
                    />
                    <TextArea
                        label="内容"
                        value={form.body}
                        onChange={(v) => setForm((f) => ({ ...f, body: v }))}
                        placeholder="お茶会の内容、メニュー、感想など..."
                        required
                        rows={6}
                        error={errors.body}
                    />
                </div>

                <div style={{
                    padding: "var(--spacing-xl)",
                    paddingTop: 0,
                    display: "flex",
                    gap: "var(--spacing-md)",
                    justifyContent: "flex-end"
                }}>
                    <Button variant="outline" onClick={onCancel} disabled={loading}>
                        キャンセル
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={loading}
                        style={{ minWidth: "100px" }}
                    >
                        {loading
                            ? <LoadingSpinner size="sm" variant="secondary" />
                            : editTarget ? "更新" : "作成"
                        }
                    </Button>
                </div>
            </div>

            <style>{`
                @keyframes modalAppear {
                    from { opacity: 0; transform: scale(0.9) translateY(-10px); }
                    to   { opacity: 1; transform: scale(1)   translateY(0);    }
                }
            `}</style>
        </div>
    );

    return createPortal(content, document.body);
}
