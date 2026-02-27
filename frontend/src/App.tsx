import React, { useState, useEffect } from "react";
import { testWrite } from "./lib/testWrite";
import { createUser } from "./services/usersService";
import { useAuth } from "./hooks/useAuth";
import { loginAndCreateUser } from "./services/authService";
import { createPost, getMyPosts, getPosts } from "./services/postService";
import { updatePost, deletePost } from "./services/postService";
import { timeAgo } from "./lib/time";

import "../index.css";

function PostForm({ user, onPosted }: any) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("タイトルと本文を入力してね");
      return;
    }

    setLoading(true);

    await createPost({
      title,
      content,
      uid: user.uid,
      authorName: user.displayName ?? "unknown"
    });

    setTitle("");
    setContent("");
    setLoading(false);

    onPosted(); // 投稿後に再取得
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 16, marginTop: 16 }}>
      <h3>投稿フォーム</h3>

      <input
        placeholder="タイトル"
        value={title}
        onChange={e => setTitle(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />

      <textarea
        placeholder="本文"
        value={content}
        onChange={e => setContent(e.target.value)}
        style={{ width: "100%", height: 80, marginBottom: 8 }}
      />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "投稿中..." : "投稿する"}
      </button>
    </div>
  );
}

const testCreateUser = async () => {
  await createUser("test-user-001", {
    name: "テスト太郎",
    email: "test@example.com",
    role: "student"
  });

  alert("ユーザー作成成功");
};

const testPost = async (user:any) => {
  await createPost({
    title: "ユーザー付き投稿",
    content: "ログインユーザーから投稿",
    uid: user.uid,
    authorName: user.displayName ?? "unknown"
  });

  alert("投稿成功");
};

function App() {
  const { user, loading } = useAuth();

  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    if (user) {
      getMyPosts(user.uid).then(setMyPosts);
    }
  }, [user]);

  useEffect(() => {
    getPosts().then(setAllPosts);
  }, []);

  if (loading) return <p>読み込み中...</p>;

    return (
      <div style={{
        background: "#f5f6f8",
        minHeight: "100vh",
        padding: "40px 20px",
        fontFamily: "system-ui, sans-serif"
      }}>

        <div style={{
          maxWidth: 900,
          margin: "0 auto"
        }}>
      
      <h1 style={{ marginBottom: 20 }}>研究室アプリ</h1>

      {user ? (
        <p>ログイン中: {user.displayName}</p>
      ) : (
        <button onClick={loginAndCreateUser}>
          Googleログイン
        </button>
      )}

      {user && (
        <PostForm
          user={user}
          onPosted={() => {
            getPosts().then(setAllPosts);
            getMyPosts(user.uid).then(setMyPosts);
          }}
        />
      )}

      {/* ===== 全投稿 ===== */}
      <h2 style={{ marginTop: 40 }}>全投稿</h2>

      {allPosts.map(p => (
        <div key={p.id} style={cardStyle}>
          <h3>{p.title}</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>{p.content}</p>
          <small style={{ color: "#666" }}>
            by {p.authorName} ・{" "}
            {p.createdAt?.toDate().toLocaleString()}
          </small>
        </div>
      ))}

      {/* ===== 自分の投稿 ===== */}
      {user && (
        <>
          <h2 style={{ marginTop: 40 }}>自分の投稿</h2>

          {myPosts.map(p => (
            <div key={p.id} style={cardStyle}>
              {editingId === p.id ? (
                <>
                  <input
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    style={inputStyle}
                  />
                  <textarea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    style={textareaStyle}
                  />

                  <div style={{ marginTop: 10 }}>
                    <button
                      onClick={async () => {
                        await updatePost(p.id, {
                          title: editTitle,
                          content: editContent
                        });
                        setEditingId(null);
                        getMyPosts(user.uid).then(setMyPosts);
                        getPosts().then(setAllPosts);
                      }}
                    >
                      保存
                    </button>

                    <button onClick={() => setEditingId(null)} style={{ marginLeft: 8 }}>
                      キャンセル
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3>{p.title}</h3>
                  <p style={{ whiteSpace: "pre-wrap" }}>{p.content}</p>

                  <small style={{ color: "#666" }}>
                    {p.createdAt && timeAgo(p.createdAt.toDate())}
                  </small>

                  <div style={{ marginTop: 10 }}>
                    <button
                      onClick={() => {
                        setEditingId(p.id);
                        setEditTitle(p.title);
                        setEditContent(p.content);
                      }}
                    >
                      編集
                    </button>

                    <button
                      onClick={async () => {
                        await deletePost(p.id);
                        getMyPosts(user.uid).then(setMyPosts);
                        getPosts().then(setAllPosts);
                      }}
                      style={{ marginLeft: 8 }}
                    >
                      削除
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </>
      )}
    </div>
    </div>

  );
}

/* ===== スタイル ===== */

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 12,
  padding: 20,
  marginTop: 12,
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  border: "1px solid #eee"
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 8,
  fontSize: 16,
  marginBottom: 8
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  padding: 8,
  minHeight: 80
};

export default App;