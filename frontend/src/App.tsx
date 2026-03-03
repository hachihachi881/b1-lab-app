import React, { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { createPost, getPosts, updatePost, deletePost } from "./services/postService";
import { getTeaPartyInfo, saveTeaPartyInfo } from "./services/teaPartyService";
import { isAdmin } from "./services/adminService";
import { signOut } from "firebase/auth";
import { auth } from "./lib/firebase";
import Settings from "./Settings";
import PresentationScheduler from "./PresentationScheduler";
import Events from "./Events";
import TeaPartyBlog from "./TeaPartyBlog";
import AppLayout from "./layouts/AppLayout";
import Container from "./layouts/Container";
import { Calendar, Sidebar, ScheduleModal, TeaPartyModal } from "./components/dashboard";
import { Button, Typography, Spacing } from "./components/common";
import "./styles/variables.css";
import "./styles/layout.css";
import "../index.css";

// await signOut(auth);

// --- メイン ---
function App() {
  const { user, loading } = useAuth();
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'presentation' | 'events' | 'blog' | 'settings'>('dashboard');
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  // 初期値（Firebaseからデータが取れるまでの仮表示）
  const [nextTeaParty, setNextTeaParty] = useState({
    title: "読込中...",
    datetime: "-",
    location: "-",
    group: "-"
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isTeaPartyModalOpen, setIsTeaPartyModalOpen] = useState(false);
  const [tpTitle, setTpTitle] = useState("");
  const [tpDatetime, setTpDatetime] = useState("");
  const [tpLocation, setTpLocation] = useState("");
  const [tpGroup, setTpGroup] = useState("");
  const [isTpSubmitting, setIsTpSubmitting] = useState(false);

  // ▼ 初回レンダリング時に予定とお茶会データをFirebaseから取得（ログイン不要）
  useEffect(() => {
    getPosts().then(setAllPosts);

    getTeaPartyInfo().then(data => {
      if (data) {
        setNextTeaParty(data);
      } else {
        setNextTeaParty({
          title: "第18回 お茶会",
          datetime: "2026年2月27日 (金) 15:00〜",
          location: "4F 輪講室",
          group: "グループB (カフェモカ)"
        });
      }
    });
  }, []);

  // ▼ 管理者チェック
  useEffect(() => {
    if (user?.email) {
      isAdmin(user.email).then(result => {
        setIsAdminUser(result);
        setCheckingAdmin(false);
      });
    } else {
      setIsAdminUser(false);
      setCheckingAdmin(false);
    }
  }, [user]);

  const handleOpenAdd = () => {
    if (!user) {
      alert("予定を追加するにはログインが必要です");
      setCurrentPage('settings');
      return;
    }
    if (!isAdminUser) {
      alert("予定を追加するには管理者権限が必要です");
      return;
    }
    setEditId(null); setTitle(""); setDate(""); setContent(""); setIsModalOpen(true);
  };

  const handleOpenEdit = (post: any) => {
    if (!user) {
      alert("予定を編集するにはログインが必要です");
      setCurrentPage('settings');
      return;
    }
    if (!isAdminUser) {
      alert("予定を編集するには管理者権限が必要です");
      return;
    }
    setEditId(post.id); setTitle(post.title); setDate(post.date || ""); setContent(post.content || ""); setIsModalOpen(true);
  };

  const handleSaveSchedule = async () => {
    if (!title || !date) return alert("タイトルと日付を入力してください");
    setIsSubmitting(true);
    if (editId) {
      await updatePost(editId, { title, content, date });
    } else {
      await createPost({ title, content, date, uid: user?.uid, authorName: user?.displayName ?? "unknown" });
    }
    setIsSubmitting(false); setIsModalOpen(false);
    getPosts().then(setAllPosts);
  };

  const handleDeleteSchedule = async () => {
    if (!editId) return;
    if (!window.confirm("この予定を削除してもよろしいですか？")) return;
    setIsSubmitting(true);
    await deletePost(editId);
    setIsSubmitting(false); setIsModalOpen(false);
    getPosts().then(setAllPosts);
  };

  const handleOpenTeaPartyEdit = () => {
    if (!user) {
      alert("お茶会情報を編集するにはログインが必要です");
      setCurrentPage('settings');
      return;
    }
    if (!isAdminUser) {
      alert("お茶会情報を編集するには管理者権限が必要です");
      return;
    }
    setTpTitle(nextTeaParty.title);
    setTpDatetime(nextTeaParty.datetime);
    setTpLocation(nextTeaParty.location);
    setTpGroup(nextTeaParty.group);
    setIsTeaPartyModalOpen(true);
  };

  // ▼ お茶会データの保存処理（Firebaseに保存）
  const handleSaveTeaParty = async () => {
    setIsTpSubmitting(true);
    const newData = {
      title: tpTitle,
      datetime: tpDatetime,
      location: tpLocation,
      group: tpGroup
    };

    try {
      // Firebaseに保存
      await saveTeaPartyInfo(newData);

      // 画面のStateを更新
      setNextTeaParty(newData);
      setIsTeaPartyModalOpen(false);
    } catch (error) {
      console.error("お茶会データの保存エラー:", error);
      alert("保存に失敗しました。開発者ツールのConsoleを確認してください。");
    } finally {
      // 成功しても失敗しても「更新中...」を解除する
      setIsTpSubmitting(false);
    }
  };


  if (loading) return <p>読み込み中...</p>;

  // 設定ページの表示
  if (currentPage === 'settings') {
    return (
      <AppLayout currentPage={currentPage} onNavigate={setCurrentPage} user={user} isAdmin={isAdminUser}>
        <Settings onBackToDashboard={() => setCurrentPage('dashboard')} />
      </AppLayout>
    );
  }

  // 発表スケジューラーページの表示
  if (currentPage === 'presentation') {
    return (
      <AppLayout currentPage={currentPage} onNavigate={setCurrentPage} user={user} isAdmin={isAdminUser}>
        <PresentationScheduler onBackToDashboard={() => setCurrentPage('dashboard')} />
      </AppLayout>
    );
  }

  // イベントページの表示
  if (currentPage === 'events') {
    return (
      <AppLayout currentPage={currentPage} onNavigate={setCurrentPage} user={user} isAdmin={isAdminUser}>
        <Events onBackToDashboard={() => setCurrentPage('dashboard')} />
      </AppLayout>
    );
  }

  // お茶会ブログページの表示
  if (currentPage === 'blog') {
    return (
      <AppLayout currentPage={currentPage} onNavigate={setCurrentPage} user={user} isAdmin={isAdminUser}>
        <TeaPartyBlog onBackToDashboard={() => setCurrentPage('dashboard')} />
      </AppLayout>
    );
  }

  // ダッシュボードの表示
  return (
    <AppLayout currentPage={currentPage} onNavigate={setCurrentPage} user={user} isAdmin={isAdminUser}>
      <Container>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <Typography variant="h1" style={{ fontSize: 24, marginBottom: 4 }}>ダッシュボード</Typography>
            <Typography variant="caption" color="#6b7280">研究室スケジュールの一元管理</Typography>
          </div>
          {user && isAdminUser && (
            <div style={{ display: "flex", gap: 12 }}>
              <Button onClick={handleOpenAdd}>
                ＋ 予定を追加
              </Button>
              <Button
                onClick={() => signOut(auth)}
                variant="secondary"
                style={{ background: "#ef4444", color: "white" }}
              >
                ログアウト
              </Button>
            </div>
          )}
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: 32,
          alignItems: "start"
        }}>
          <Calendar posts={allPosts} onEventClick={handleOpenEdit} />
          <Sidebar
            nextTeaParty={nextTeaParty}
            onEditTeaParty={handleOpenTeaPartyEdit}
            isAdmin={isAdminUser}
          />
        </div>
      </Container>

      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editId={editId}
        title={title}
        setTitle={setTitle}
        date={date}
        setDate={setDate}
        content={content}
        setContent={setContent}
        onSave={handleSaveSchedule}
        onDelete={editId ? handleDeleteSchedule : undefined}
        isSubmitting={isSubmitting}
      />

      <TeaPartyModal
        isOpen={isTeaPartyModalOpen}
        onClose={() => setIsTeaPartyModalOpen(false)}
        title={tpTitle}
        setTitle={setTpTitle}
        datetime={tpDatetime}
        setDatetime={setTpDatetime}
        location={tpLocation}
        setLocation={setTpLocation}
        group={tpGroup}
        setGroup={setTpGroup}
        onSave={handleSaveTeaParty}
        isSubmitting={isTpSubmitting}
      />
    </AppLayout>
  );
}

export default App;