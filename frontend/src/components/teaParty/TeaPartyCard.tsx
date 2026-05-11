import React, { useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import ConfirmModal from "../feedback/ConfirmModal";
import { TeaParty } from "../../services/teaParties/teaPartiesService";

interface TeaPartyCardProps {
    teaParty: TeaParty;
    isAdmin: boolean;
    onEdit: (teaParty: TeaParty) => void;
    onDelete: (id: string) => Promise<void>;
}

function formatDate(dateStr: string): string {
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const [year, month, day] = parts.map(Number);
    return `${year}年${month}月${day}日`;
}

export default function TeaPartyCard({ teaParty, isAdmin, onEdit, onDelete }: TeaPartyCardProps) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleConfirmDelete = async () => {
        setDeleting(true);
        await onDelete(teaParty.id);
        setDeleting(false);
        setConfirmOpen(false);
    };

    return (
        <>
            <Card style={{ marginBottom: "var(--spacing-md)" }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "var(--spacing-sm)"
                }}>
                    <span style={{
                        fontSize: "var(--font-size-sm)",
                        color: "var(--color-text-sub)",
                        backgroundColor: "var(--color-bg-main)",
                        padding: "2px var(--spacing-sm)",
                        borderRadius: "var(--radius-sm)",
                        fontWeight: "500"
                    }}>
                        {formatDate(teaParty.date)}
                    </span>
                    {isAdmin && (
                        <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
                            <Button variant="ghost" size="sm" onClick={() => onEdit(teaParty)}>
                                編集
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => setConfirmOpen(true)}>
                                削除
                            </Button>
                        </div>
                    )}
                </div>

                <h2 style={{
                    fontSize: "var(--font-size-h2)",
                    fontWeight: "600",
                    color: "var(--color-text-main)",
                    margin: "0 0 var(--spacing-md) 0"
                }}>
                    {teaParty.title}
                </h2>

                <p style={{
                    fontSize: "var(--font-size-base)",
                    color: "var(--color-text-main)",
                    lineHeight: "1.6",
                    margin: 0,
                    whiteSpace: "pre-wrap"
                }}>
                    {teaParty.body}
                </p>

                {teaParty.nextDate && (
                    <div style={{
                        marginTop: "var(--spacing-md)",
                        padding: "var(--spacing-sm) var(--spacing-md)",
                        backgroundColor: "rgba(59, 130, 246, 0.05)",
                        borderRadius: "var(--radius-button)",
                        borderLeft: "3px solid var(--color-primary)"
                    }}>
                        <span style={{
                            fontSize: "var(--font-size-sm)",
                            color: "var(--color-primary)",
                            fontWeight: "500"
                        }}>
                            次回予定: {formatDate(teaParty.nextDate)}
                        </span>
                    </div>
                )}
            </Card>

            <ConfirmModal
                isOpen={confirmOpen}
                title="お茶会ブログを削除"
                message={`「${teaParty.title}」を削除しますか？この操作は取り消せません。`}
                confirmText="削除"
                confirmVariant="danger"
                loading={deleting}
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmOpen(false)}
            />
        </>
    );
}
