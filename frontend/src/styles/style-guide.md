/* BEM スタイルガイド

当プロジェクトではBEM（Block Element Modifier）方法論を採用し、
一貫したクラス命名とコンポーネント設計を実装しています。

## 基本構造

```
.block
.block__element
.block__element--modifier
```

## 使用例

### Button コンポーネント
```tsx
<Button variant="primary" size="lg">Submit</Button>
```
出力されるクラス:
```css
.button.button--primary.button--lg
```

### Navbar コンポーネント
```tsx
<nav className="navbar">
  <div className="navbar__links">
    <a className="navbar__item navbar__item--active">Home</a>
  </div>
</nav>
```

### StatusBadge コンポーネント
```tsx
<StatusBadge status="完了" variant="schedule" />
```
出力されるクラス:
```css
.status-badge.status-badge--done
```

## レイアウト規則

### ページコンテナ
全てのページは `.page-container` を使用してコンテンツ幅を制限する

### セクション間隔
セクション間は `.layout-section` または `--spacing-lg` を使用

### グリッドレイアウト
```tsx
<div className="layout-grid layout-grid--two-column">
  <main>メインコンテンツ</main>
  <aside>サイドバー</aside>
</div>
```

## カラーシステム

### 主要カラー
- `--color-primary`: メインブランドカラー
- `--color-secondary`: セカンダリカラー
- `--color-danger`: エラー・削除アクション

### ステータスカラー
- `--color-status-done`: 完了状態（緑）
- `--color-status-pending`: 待機状態（オレンジ）

### テキストカラー
- `--color-text-main`: メインテキスト（暗いグレー）
- `--color-text-sub`: サブテキスト（ライトグレー）

### 背景カラー
- `--color-bg-main`: メイン背景（ライトグレー）
- `--color-bg-sub`: カード背景（白）

## コンポーネント設計原則

1. **単一責任**: 各コンポーネントは1つの明確な責任を持つ
2. **再利用性**: プロパティで見た目を制御し、用途に応じて再利用可能
3. **一貫性**: 同じ種類の要素は同じコンポーネントを使用
4. **レスポンシブ**: モバイルファーストでデザイン

## 禁止事項

❌ **避けるべき実装**:
```tsx
// マジックナンバーの使用
<div style={{ marginTop: 16, color: '#3b82f6' }} />

// インラインでのスタイル定義
<button style={{ padding: '8px 16px', backgroundColor: '#ef4444' }}>

// 独自カード実装
<div className="my-custom-card" style={{ border: '1px solid #ccc' }} />
```

✅ **推奨される実装**:
```tsx
// CSS変数の使用
<div className="layout-section" />

// 共通コンポーネントの使用
<Button variant="danger">削除</Button>

// 共通カードコンポーネント
<Card>コンテンツ</Card>
```

## ファイル構成

```
src/
├── styles/
│   ├── variables.css    # CSS変数定義
│   └── layout.css       # レイアウト用クラス
├── components/
│   └── common/          # 共通コンポーネント
│       ├── Button.tsx
│       ├── Card.tsx
│       └── StatusBadge.tsx
└── layouts/
    └── AppLayout.tsx    # アプリケーション全体のレイアウト
```

## メディアクエリ

標準ブレークポイント:
- `768px`: タブレット
- `1024px`: デスクトップ

モバイルファーストアプローチを採用。
*/