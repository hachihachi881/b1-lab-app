import React from "react";
import { useState, useEffect } from "react";
import { testWrite } from "./lib/testWrite";
import { createUser } from "./services/usersService";
import { useAuth } from "./hooks/useAuth";
import { loginAndCreateUser } from "./services/authService";
import { createPost } from "./services/postService";
import { getMyPosts } from "./services/postService";

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
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      getMyPosts(user.uid).then(setPosts);
    }
  }, [user]);

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

      {user && (
        <button onClick={() => testPost(user)}>
          ユーザー付き投稿
        </button>
      )}

      <h2>自分の投稿</h2>

      {posts.map(p => (
        <div key={p.id}>
          <h3>{p.title}</h3>
          <p>{p.content}</p>
        </div>
      ))}
    

    </div>
  );
}

export default App;