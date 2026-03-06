/**
 * PostCard Component
 * 
 * 投稿データを表示するカードコンポーネント
 * 投稿一覧、詳細表示、ダッシュボードなどで使用
 * 編集・削除機能、作成者情報、相対時間表示をサポート
 * 
 * @param post - 表示する投稿データ
 * @param showAuthor - 作成者情報を表示するか
 * @param onEdit - 編集ボタンクリック時のコールバック
 * @param onDelete - 削除ボタンクリック時のコールバック
 * @param compact - コンパクト表示モード
 */
import React, { useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Typography from "../ui/Typography";
import ConfirmModal from "../feedback/ConfirmModal";
import { Post } from "../../types";
import { timeAgo } from "../../lib/time";

interface PostCardProps {
    post: Post;
    showAuthor?: boolean;
    onEdit?: (post: Post) => void;
    onDelete?: (postId: string) => void;
    compact?: boolean;
    currentUserId?: string; // 現在のユーザーID（編集・削除権限判定用）
    isAdmin?: boolean; // 管理者かどうか
}

export default function PostCard({
    post,
    showAuthor = true,
    onEdit,
    onDelete,
    compact = false,
    currentUserId,
    isAdmin = false
}: PostCardProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // 編集・削除権限の判定
    const canEdit = currentUserId === post.uid || isAdmin;
    const canDelete = currentUserId === post.uid || isAdmin;

    // 投稿日時の表示
    const getDisplayDate = () => {
        try {
            if (post.createdAt?.toDate) {
                return timeAgo(post.createdAt.toDate());
            } else {
                return timeAgo(new Date(post.createdAt));
            }
        } catch (error) {
            return "投稿日不明";
        }
    };

    // コンテンツの切り詰め
    const getTruncatedContent = (content: string, maxLength: number) => {
        if (content.length <= maxLength) return content;
        return content.slice(0, maxLength) + "...";
    };

    const handleEdit = () => {
        onEdit?.(post);
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        if (!onDelete) return;

        setIsDeleting(true);
        try {
            await onDelete(post.id);
            setShowDeleteConfirm(false);
        } catch (error) {
            console.error("削除エラー:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const headerStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: compact ? "var(--spacing-sm)" : "var(--spacing-md)",
        gap: "var(--spacing-sm)"
    };

    const titleAreaStyle: React.CSSProperties = {
        flex: 1,
        minWidth: 0
    };

    const metaStyle: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        gap: "var(--spacing-sm)",
        color: "var(--color-text-sub)",
        fontSize: "var(--font-size-sm)",
        marginTop: "var(--spacing-xs)"
    };

    const contentStyle: React.CSSProperties = {
        marginBottom: compact ? "var(--spacing-sm)" : "var(--spacing-md)",
        lineHeight: "1.6"
    };

    const actionsStyle: React.CSSProperties = {
        display: "flex",
        gap: "var(--spacing-sm)",
        justifyContent: "flex-end"
    };

    return (
        <>
            <Card padding={compact ? 16 : 24}>
                <div style={headerStyle}>
                    <div style={titleAreaStyle}>
                        <Typography variant={compact ? "h3" : "h2"}>
                            {post.title}
                        </Typography>

                        {showAuthor && (
                            <div style={metaStyle}>
                                <span>{post.authorName}</span>
                                <span>•</span>
                                <span>{getDisplayDate()}</span>
                            </div>
                        )}
                    </div>

                    {(canEdit || canDelete) && (
                        <div style={actionsStyle}>
                            {canEdit && onEdit && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleEdit}
                                >
                                    編集
                                </Button>
                            )}
                            {canDelete && onDelete && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleDeleteClick}
                                >
                                    削除
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                <div style={contentStyle}>
                    <Typography variant="p">
                        {compact
                            ? getTruncatedContent(post.content, 150)
                            : post.content
                        }
                    </Typography>
                </div>
            </Card>

            <ConfirmModal
                isOpen={showDeleteConfirm}
                title="投稿を削除"
                message="この投稿を削除しますか？この操作は取り消せません。"
                confirmText="削除する"
                cancelText="キャンセル"
                confirmVariant="danger"
                loading={isDeleting}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </>
    );
}