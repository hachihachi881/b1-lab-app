# 🧪 B1LabApp

研究室向けの情報共有・スケジュール管理 Web アプリケーションです。  
Google 認証によるログイン、カレンダーベースの発表スケジュール管理、お茶会ブログ機能などを備えています。

---

## 機能

| 機能 | 説明 |
|------|------|
| ダッシュボード | カレンダーと投稿一覧でスケジュールを管理 |
| お茶会ブログ | お茶会の情報（日時・場所・メニューなど）を投稿・共有 |
| 発表 | 発表日・担当者などの予定を登録・編集・削除 |
| イベント | イベント開催日，内容を登録・編集・削除 |
| 設定ページ | メンバーやロールなど各種設定を管理 |

---

## 技術スタック

| カテゴリ | 技術 |
|----------|------|
| フロントエンド | React 18 + TypeScript + Vite |
| バックエンド (BaaS) | Firebase (Firestore / Authentication) |
| コンテナ | Docker / Docker Compose |

---

## 開発環境

- Node.js は `20` 系を使用してください（Cloud Functions の `engines.node` と合わせるため）。
- `nvm` 利用時はリポジトリルートで次を実行します。

```bash
nvm install 20
nvm use
```

---

## ディレクトリ構成

```
b1-lab-app/
├── .gitignore                  # Git の除外設定
├── README.md                   # 本ファイル
├── docker/
│   ├── Dockerfile              # フロントエンド用 Docker イメージ定義
│   └── docker-compose.yml      # 開発環境の Compose 設定
├── firebase/
│   ├── firebase.json            # Firebase プロジェクト設定
│   ├── firestore.indexes.json   # Firestore インデックス定義
│   └── firestore.rules          # Firestore セキュリティルール
└── frontend/
    ├── .env.example             # 環境変数テンプレート
    ├── .env.local               # ローカル用環境変数（各人で作成）
    ├── index.css                # グローバルスタイル
    ├── index.html               # Vite の HTML エントリ
    ├── package-lock.json        # npm 依存関係ロックファイル
    ├── package.json             # 依存関係とスクリプト定義
    ├── tsconfig.json            # TypeScript 設定
    ├── dist/                    # ビルド出力ディレクトリ
    ├── node_modules/            # 依存パッケージ
    └── src/
        ├── App.tsx               # 画面ルーティングの起点コンポーネント
        ├── main.tsx              # React アプリのエントリポイント
        ├── Dashboard.tsx         # ダッシュボード画面
        ├── Events.tsx            # イベント管理画面
        ├── Presentation.tsx      # 発表スケジュール画面
        ├── Settings.tsx          # 設定画面
        ├── TeaPartyBlog.tsx      # お茶会ブログ画面
        ├── vite-env.d.ts         # Vite 型定義
        ├── components/
        │   ├── index.ts          # コンポーネント再エクスポート
        │   ├── feedback/
        │   │   ├── ConfirmModal.tsx    # 確認ダイアログ
        │   │   ├── ErrorBoundary.tsx   # 例外ハンドリング UI
        │   │   ├── index.ts            # feedback コンポーネント集約
        │   │   ├── LoadingSpinner.tsx  # 読み込み中表示
        │   │   ├── Toast.tsx           # トースト表示コンポーネント
        │   │   └── ToastContext.tsx    # トースト状態管理
        │   ├── forms/
        │   │   ├── DatePicker.tsx      # 日付入力コンポーネント
        │   │   ├── Input.tsx           # テキスト入力コンポーネント
        │   │   ├── TextArea.tsx        # 複数行入力コンポーネント
        │   │   └── index.ts            # forms コンポーネント集約
        │   ├── posts/
        │   │   ├── PostCard.tsx        # 投稿カード表示
        │   │   ├── PostList.tsx        # 投稿一覧表示
        │   │   └── index.ts            # posts コンポーネント集約
        │   └── ui/
        │       ├── Button.tsx          # 共通ボタン UI
        │       ├── Card.tsx            # 共通カード UI
        │       ├── Spacing.tsx         # 余白調整コンポーネント
        │       ├── Typography.tsx      # 文字スタイルコンポーネント
        │       └── index.ts            # ui コンポーネント集約
        ├── hooks/
        │   ├── index.ts          # カスタムフック再エクスポート
        │   ├── useAdmin.ts       # 管理者権限判定フック
        │   └── useAuth.ts        # 認証状態取得フック
        ├── layouts/
        │   ├── AppLayout.tsx     # 全体レイアウト
        │   ├── Container.tsx     # 画面幅コンテナ
        │   ├── PageHeader.tsx    # ページ見出し
        │   └── index.ts          # layout コンポーネント集約
        ├── lib/
        │   ├── firebase.ts       # Firebase 初期化・設定
        │   ├── testWrite.ts      # Firestore 書き込みテスト補助
        │   └── time.ts           # 日時ユーティリティ
        ├── services/
        │   ├── adminService.ts   # 管理者向けデータ操作
        │   ├── authService.ts    # 認証関連 API ラッパー
        │   ├── postService.ts    # 投稿データ操作
        │   ├── teaPartyService.ts # お茶会データ操作
        │   └── usersService.ts   # ユーザーデータ操作
        ├── styles/
        │   ├── layout.css        # レイアウト用スタイル
        │   └── variables.css     # デザイン変数定義
        ├── types/
        │   └── index.ts          # 型定義の集約
        └── utils/
            ├── errorHandler.ts   # エラーハンドリング補助
            └── LoginForm.tsx     # ログインフォーム UI
```

## ライセンス

このプロジェクトは研究室内での利用を目的としています。

