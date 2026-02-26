import React, { useState, useEffect } from "react";
import { testWrite } from "./lib/testWrite";
import { createUser } from "./services/usersService";
import { useAuth } from "./hooks/useAuth";
import { loginAndCreateUser } from "./services/authService";
import { createPost, getMyPosts, getPosts } from "./services/postService";
import { updatePost, deletePost } from "./services/postService";

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
    <div>
      <h1>Firestoreテスト</h1>

      <button onClick={testWrite}>
        Firebase書き込みテスト
      </button>

      <button onClick={testCreateUser}>
        ユーザー作成テスト
      </button>

      <h1>研究室アプリ</h1>

      {user ? (
        <>
          <p>ログイン中: {user.displayName}</p>
        </>
      ) : (
        <button onClick={loginAndCreateUser}>
          Googleログイン
        </button>
      )}

      {/* {user && (
        <button onClick={() => testPost(user)}>
          ユーザー付き投稿
        </button>
      )} */}

      {user && (
        <PostForm
          user={user}
          onPosted={() => getMyPosts(user.uid).then(setMyPosts)}
        />
      )}

      {/* <h2>自分の投稿</h2>
      {myPosts.map(p => (
        <div key={p.id}>
          <h3>{p.title}</h3>
          <p>{p.content}</p>
        </div>
      ))}

      <h2>全投稿</h2>
      {allPosts.map(p => (
        <div key={p.id}>
          <h3>{p.title}</h3>
          <p>{p.content}</p>
          <small>by {p.authorName}</small>
        </div>
      ))} */}

      {myPosts.map(p => (
        <div key={p.id} style={{ border: "1px solid #ccc", padding: 8, marginBottom: 8 }}>
          
          {editingId === p.id ? (
            <>
              <input
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
              />
              <textarea
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
              />

              <button
                onClick={async () => {
                  await updatePost(p.id, {
                    title: editTitle,
                    content: editContent
                  });
                  setEditingId(null);
                  getMyPosts(user.uid).then(setMyPosts);
                }}
              >
                保存
              </button>

              <button onClick={() => setEditingId(null)}>
                キャンセル
              </button>
            </>
          ) : (
            <>
              <h3>{p.title}</h3>
              <p>{p.content}</p>

              {user?.uid === p.uid && (
                <>
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
                    }}
                  >
                    削除
                  </button>
                </>
              )}
            </>
          )}
        </div>
      ))}

    </div>
  );
}

export default App;