# 🧪 B1LabApp

研究室向けの情報共有・スケジュール管理 Web アプリケーションです。  
Google 認証によるログイン、カレンダーベースの発表スケジュール管理、お茶会ブログ機能などを備えています。

---

## 機能

| 機能 | 説明 |
|------|------|
| Google ログイン | Firebase Authentication による Google アカウント認証 |
| ダッシュボード | カレンダーと投稿一覧でスケジュールを管理 |
| 発表スケジューラー | 発表日・担当者などの予定を登録・編集・削除 |
| お茶会ブログ | お茶会の情報（日時・場所・メニューなど）を投稿・共有 |

---

## 技術スタック

| カテゴリ | 技術 |
|----------|------|
| フロントエンド | React 18 + TypeScript + Vite |
| バックエンド (BaaS) | Firebase (Firestore / Authentication) |
| コンテナ | Docker / Docker Compose |

---

## ディレクトリ構成

```
b1-lab-app/
├──.env
├── docker/
│   ├── Dockerfile           # フロントエンド用 Docker イメージ
│   └── docker-compose.yml   # 開発環境用 Compose 設定
├── firebase/
│   ├── firebase.json
│   ├── firestore.indexes.json
│   └── firestore.rules      # Firestore セキュリティルール
└── frontend/
    ├── index.html
    ├── index.css
    ├── package.json
    └── src/
        ├── App.tsx
        ├── main.tsx
        ├── PostForm.tsx
        ├── components/
        ├── hooks/
        │   └── useAuth.ts
        ├── lib/
        │   └── firebase.ts   # Firebase 初期化・設定
        ├── pages/
        ├── services/         # Firestore 操作ロジック
        ├── types/
        └── utils/
```

---

## セットアップ

### 前提条件

- [Node.js](https://nodejs.org/) v22 以上
- [Docker](https://www.docker.com/) (Docker を使う場合)
- Firebase プロジェクト

### 1. リポジトリのクローン

```bash
git clone https://github.com/<your-username>/b1-lab-app.git
cd b1-lab-app
```

### 2. 環境変数の設定

`frontend/` ディレクトリに `.env` ファイルを作成し、Firebase プロジェクトの設定値を記入します。

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MSG=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> **Note:** `.env` ファイルは機密情報を含むため、`.gitignore` に追加して Git にコミットしないようにしてください。

### 3a. ローカルで起動（npm）

```bash
cd frontend
npm install
npm run dev
```

ブラウザで `http://localhost:5173` を開きます。

### 3b. Docker で起動

```bash
cd docker
docker compose up --build
```

ブラウザで `http://localhost:5173` を開きます。

---

## 利用可能なスクリプト

`frontend/` ディレクトリ内で実行します。

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | 本番用ビルドを生成 |
| `npm run preview` | ビルド結果をプレビュー |
| `npm run lint` | ESLint でコードをチェック |

---

## Firebase の設定

1. [Firebase Console](https://console.firebase.google.com/) でプロジェクトを作成
2. **Authentication** → ログイン方法 → **Google** を有効化
3. **Firestore Database** を作成し、`firebase/firestore.rules` のルールを適用
4. プロジェクトの設定から Web アプリの構成情報を取得し、`.env` に設定

---

## ライセンス

このプロジェクトは研究室内での利用を目的としています。

