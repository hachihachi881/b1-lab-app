import React, { useState, useEffect, useCallback } from "react";
import { useAdmin } from "./hooks/useAdmin";
import { useToast } from "./components/feedback/ToastContext";
import {
    teaPartiesList,
    teaPartiesCreate,
    teaPartiesUpdate,
    teaPartiesDelete,
    TeaParty,
} from "./services/teaParties/teaPartiesService";
import Container from "./layouts/Container";
import PageHeader from "./layouts/PageHeader";
import { LoadingSpinner } from "./components";
import { TeaPartyCard, TeaPartyFormModal } from "./components/teaParty";
import Button from "./components/ui/Button";
import Input from "./components/forms/Input";

interface TeaPartyBlogProps {
    onBackToDashboard: () => void;
}

export default function TeaPartyBlog({ onBackToDashboard }: TeaPartyBlogProps) {
    const { isAdmin } = useAdmin();
    const { showToast } = useToast();

    const [teaParties, setTeaParties] = useState<TeaParty[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const [formOpen, setFormOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<TeaParty | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const loadTeaParties = useCallback(async () => {
        setLoading(true);
        try {
            const res = await teaPartiesList();
            if (res.ok && res.data) {
                setTeaParties([...res.data].sort((a, b) => b.date.localeCompare(a.date)));
            }
        } catch {
            showToast("error", "お茶会ブログの取得に失敗しました");
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => { loadTeaParties(); }, [loadTeaParties]);

    const handleCreate = () => {
        setEditTarget(null);
        setFormOpen(true);
    };

    const handleEdit = (tp: TeaParty) => {
        setEditTarget(tp);
        setFormOpen(true);
    };

    const handleSubmit = async (data: Omit<TeaParty, "id">) => {
        setSubmitting(true);
        try {
            if (editTarget) {
                await teaPartiesUpdate({ id: editTarget.id, teaParty: data });
                showToast("success", "お茶会ブログを更新しました");
            } else {
                await teaPartiesCreate({ teaParty: data });
                showToast("success", "お茶会ブログを作成しました");
            }
            setFormOpen(false);
            loadTeaParties();
        } catch {
            showToast("error", "操作に失敗しました。もう一度お試しください。");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await teaPartiesDelete({ id });
            showToast("success", "お茶会ブログを削除しました");
            setTeaParties((prev) => prev.filter((tp) => tp.id !== id));
        } catch {
            showToast("error", "削除に失敗しました。もう一度お試しください。");
        }
    };

    const filtered = teaParties.filter(
        (tp) =>
            tp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tp.body.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Container>
            <PageHeader
                title="お茶会ブログ"
                description="研究室お茶会の記録と思い出"
                onBack={onBackToDashboard}
            />

            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "var(--spacing-lg)",
                gap: "var(--spacing-md)",
                flexWrap: "wrap"
            }}>
                <Input
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="タイトル・内容で検索..."
                    style={{ maxWidth: "320px" }}
                />
                {isAdmin && (
                    <Button onClick={handleCreate}>+ 新規作成</Button>
                )}
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: "var(--spacing-xl)" }}>
                    <LoadingSpinner text="読み込み中..." />
                </div>
            ) : filtered.length === 0 ? (
                <div style={{
                    textAlign: "center",
                    padding: "var(--spacing-xl)",
                    color: "var(--color-text-sub)",
                    fontSize: "var(--font-size-base)"
                }}>
                    {searchQuery ? "検索条件に一致する投稿がありません" : "まだ投稿がありません"}
                </div>
            ) : (
                filtered.map((tp) => (
                    <TeaPartyCard
                        key={tp.id}
                        teaParty={tp}
                        isAdmin={isAdmin}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))
            )}

            <TeaPartyFormModal
                isOpen={formOpen}
                editTarget={editTarget}
                loading={submitting}
                onSubmit={handleSubmit}
                onCancel={() => setFormOpen(false)}
            />
        </Container>
    );
}
