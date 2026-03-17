# API Quickstart (1回APIを実行するまで)

このドキュメントは、ローカル環境で Firebase Emulator を起動し、フロントエンドから API を1回呼ぶまでの最短手順です。

## 前提

- OS: Windows
- Node.js: 20 系
- 作業ディレクトリ: `c:\Users\youhei\Desktop\b1develop\b1-lab-app`

## 0. ターミナルの注意

PowerShell で `npm.ps1` の実行ポリシーエラーが出る場合があります。
その場合は次のどちらかを使ってください。

- コマンドプロンプト (`cmd`) を使う
- PowerShellで一時的に許可する

```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force
```

## 1. 依存関係をインストール

### フロントエンド

```cmd
cd c:\Users\youhei\Desktop\b1develop\b1-lab-app\frontend
npm install
```

### Functions

```cmd
cd c:\Users\youhei\Desktop\b1develop\b1-lab-app\firebase\functions
npm install
```

## 2. Firebase CLI を使えるようにする

`firebase` コマンドが見つからない場合は、次のどちらかを使います。

### A. グローバルインストール

```cmd
npm install -g firebase-tools
```

### B. npx で実行（インストール不要）

```cmd
npx firebase-tools --version
```

## 3. Emulator を起動

別ターミナルを開いて実行:

```cmd
cd c:\Users\youhei\Desktop\b1develop\b1-lab-app\firebase
firebase emulators:start
```

グローバルインストールしていない場合:

```cmd
cd c:\Users\youhei\Desktop\b1develop\b1-lab-app\firebase
npx firebase-tools emulators:start
```

起動ポート（このプロジェクト）:

- Functions: `5001`
- Firestore: `8080`
- Auth: `9099`
- Emulator UI: `http://localhost:4000`

## 4. フロントエンドを起動

さらに別ターミナルで実行:

```cmd
cd c:\Users\youhei\Desktop\b1develop\b1-lab-app\frontend
npm run dev
```

ブラウザで以下を開く:

- `http://localhost:5173`

## 5. API を1回実行して確認

`Events` 画面を開くと、一覧取得 API (`eventsList`) が呼ばれます。
これで「APIを1回実行」の確認ができます。

確認方法:

- ブラウザ DevTools の Network で `eventsList` を確認
- Emulator UI (`http://localhost:4000`) の Logs でも確認可能

補足:

- `OPTIONS` は CORS の事前リクエストです（正常）
- 実処理は `POST` です

## 6. よくあるエラーと対処

### `firebase` コマンドが見つからない

- `npm install -g firebase-tools`
- もしくは `npx firebase-tools emulators:start` を使う

### `react` / `firebase-functions` のモジュールが見つからない

- `frontend` と `firebase/functions` の両方で `npm install` を実行

### `forbidden` / `管理者権限が必要`

- `eventsCreate`, `eventsUpdate`, `eventsDelete` は管理者のみ実行可能
- Firestore の `members/{uid}` に `isAdmin: true` を設定して確認

### Emulator バナー表示

`Running in emulator mode. Do not use with production credentials.` は開発時の正常表示です。

## 7. 停止方法

各ターミナルで `Ctrl + C` を押して停止します。
