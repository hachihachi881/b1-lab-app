import { useState } from "react";
import { createPost } from "../services/postService";

type Props = {
  user: any;
  onPosted: () => void;
};

export default function PostForm({ user, onPosted }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!title.trim() || !content.trim()) return;

    setLoading(true);

    await createPost({
      title,
      content,
      uid: user.uid,
      authorName: user.displayName,
      createdAt: new Date()
    });

    setTitle("");
    setContent("");
    setLoading(false);
    onPosted();
  };

  return (
    <div style={cardStyle}>
      <h2 style={{ marginBottom: 12 }}>投稿を作成</h2>

      <input
        placeholder="タイトル"
        value={title}
        onChange={e => setTitle(e.target.value)}
        style={inputStyle}
      />

      <textarea
        placeholder="内容を書く..."
        value={content}
        onChange={e => setContent(e.target.value)}
        style={textareaStyle}
      />

      <button
        onClick={handlePost}
        disabled={loading}
        style={buttonStyle}
      >
        {loading ? "投稿中..." : "投稿する"}
      </button>
    </div>
  );
}

/* ===== スタイル ===== */

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 14,
  padding: 20,
  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
  border: "1px solid #eee",
  marginTop: 20
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 10,
  fontSize: 16,
  marginBottom: 10,
  borderRadius: 8,
  border: "1px solid #ccc"
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  padding: 10,
  fontSize: 15,
  minHeight: 100,
  marginBottom: 12,
  borderRadius: 8,
  border: "1px solid #ccc"
};

const buttonStyle: React.CSSProperties = {
  padding: "10px 18px",
  fontSize: 16,
  borderRadius: 10,
  border: "none",
  background: "#4f46e5",
  color: "white",
  cursor: "pointer"
};