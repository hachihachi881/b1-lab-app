import React, { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "./lib/firebase";
import Settings from "./Settings";
import Presentation from "./Presentation";
import Events from "./Events";
import TeaPartyBlog from "./TeaPartyBlog";
import AppLayout from "./layouts/AppLayout";
import Container from "./layouts/Container";
import { Card, Typography } from "./components/common";
import "./styles/variables.css";
import "./styles/layout.css";
import "../index.css";

function App() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'presentation' | 'events' | 'blog' | 'settings'>('dashboard');

  const handleSignOut = async () => {
    await signOut(auth);
  };

  if (loading) return <p>読み込み中...</p>;

  // 設定ページの表示
  if (currentPage === 'settings') {
    return (
      <AppLayout
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        user={user}
        isAdmin={false}
        onSignOut={handleSignOut}
      >
        <Settings onBackToDashboard={() => setCurrentPage('dashboard')} />
      </AppLayout>
    );
  }

  // 発表ページの表示
  if (currentPage === 'presentation') {
    return (
      <AppLayout
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        user={user}
        isAdmin={false}
        onSignOut={handleSignOut}
      >
        <Presentation onBackToDashboard={() => setCurrentPage('dashboard')} />
      </AppLayout>
    );
  }

  // イベントページの表示
  if (currentPage === 'events') {
    return (
      <AppLayout
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        user={user}
        isAdmin={false}
        onSignOut={handleSignOut}
      >
        <Events onBackToDashboard={() => setCurrentPage('dashboard')} />
      </AppLayout>
    );
  }

  // お茶会ブログページの表示
  if (currentPage === 'blog') {
    return (
      <AppLayout
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        user={user}
        isAdmin={false}
        onSignOut={handleSignOut}
      >
        <TeaPartyBlog onBackToDashboard={() => setCurrentPage('dashboard')} />
      </AppLayout>
    );
  }

  // ダッシュボードの表示
  return (
    <AppLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      user={user}
      isAdmin={false}
      onSignOut={handleSignOut}
    >
      <Card>
        <Typography variant="h1">ダッシュボード</Typography>
        <Typography variant="body" style={{ marginTop: "var(--spacing-md)", color: "var(--color-text-sub)" }}>
          こちらのページは各メンバーによって実装される予定です。
        </Typography>
      </Card>
    </AppLayout>
  );
}

export default App;