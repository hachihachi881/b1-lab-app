/**
 * PostList Component
 * 
 * 投稿の一覧を表示するコンポーネント
 * ローディング状態、空状態、ページネーションをサポート
 * PostCardコンポーネントを使用して各投稿を表示
 * 
 * @param posts - 表示する投稿の配列
 * @param loading - ローディング状態
 * @param onEdit - 投稿編集時のコールバック
 * @param onDelete - 投稿削除時のコールバック
 * @param emptyMessage - 投稿が0件の場合のメッセージ
 * @param showLoadMore - もっと見るボタンを表示するか
 * @param onLoadMore - もっと見るボタンクリック時のコールバック
 * @param currentUserId - 現在のユーザーID
 * @param isAdmin - 管理者かどうか
 * @param compact - コンパクト表示モード
 */
import React from "react";
import PostCard from "./PostCard";
import LoadingSpinner from "../feedback/LoadingSpinner";
import Button from "../ui/Button";
import Typography from "../ui/Typography";
import Card from "../ui/Card";
import { Post } from "../types";

interface PostListProps {
    posts: Post[];
    loading?: boolean;
    onEdit?: (post: Post) => void;
    onDelete?: (postId: string) => void;
    emptyMessage?: string;
    showLoadMore?: boolean;
    onLoadMore?: () => void;
    loadMoreLoading?: boolean;
    currentUserId?: string;
    isAdmin?: boolean;
    compact?: boolean;
}

export default function PostList({
    posts,
    loading = false,
    onEdit,
    onDelete,
    emptyMessage = "投稿がありません",
    showLoadMore = false,
    onLoadMore,
    loadMoreLoading = false,
    currentUserId,
    isAdmin = false,
    compact = false
}: PostListProps) {

    const containerStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        gap: compact ? "var(--spacing-md)" : "var(--spacing-lg)",
        width: "100%"
    };

    const loadMoreContainerStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: "center",
        marginTop: "var(--spacing-lg)"
    };

    const emptyStateStyle: React.CSSProperties = {
        textAlign: "center",
        padding: "var(--spacing-xl)"
    };

    // ローディング状態
    if (loading && posts.length === 0) {
        return (
            <div style={containerStyle}>
                <LoadingSpinner
                    size="lg"
                    text="投稿を読み込み中..."
                />
            </div>
        );
    }

    // 空状態
    if (!loading && posts.length === 0) {
        return (
            <Card>
                <div style={emptyStateStyle}>
                    <Typography variant="h3" style={{ color: "var(--color-text-sub)", marginBottom: "var(--spacing-md)" }}>
                        📝
                    </Typography>
                    <Typography variant="p" style={{ color: "var(--color-text-sub)" }}>
                        {emptyMessage}
                    </Typography>
                </div>
            </Card>
        );
    }

    return (
        <div style={containerStyle}>
            {/* 投稿リスト */}
            {posts.map((post) => (
                <PostCard
                    key={post.id}
                    post={post}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    currentUserId={currentUserId}
                    isAdmin={isAdmin}
                    compact={compact}
                />
            ))}

            {/* もっと見るボタン */}
            {showLoadMore && onLoadMore && (
                <div style={loadMoreContainerStyle}>
                    <Button
                        variant="outline"
                        onClick={onLoadMore}
                        disabled={loadMoreLoading}
                        style={{ minWidth: "150px" }}
                    >
                        {loadMoreLoading ? (
                            <LoadingSpinner size="sm" />
                        ) : (
                            "もっと見る"
                        )}
                    </Button>
                </div>
            )}

            {/* 初期ロード中のインジケーター（既存投稿がある場合） */}
            {loading && posts.length > 0 && (
                <div style={loadMoreContainerStyle}>
                    <LoadingSpinner size="md" text="読み込み中..." />
                </div>
            )}
        </div>
    );
}