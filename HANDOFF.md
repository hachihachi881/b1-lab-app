# 置手紙（API実装担当へ）

このプロジェクトは、**閲覧は公開**、**編集は管理者のみ** の方針です。

## まずやること（この順）

1. `firebase/functions` に移動して `npm install`
2. `npm run build` が通るか確認
3. `src/core/auth.ts` と `src/core/guard.ts` を実装
4. `authGetSession` を実装
5. `membersList / membersRegister / membersUpdate / membersDelete` を実装

## 絶対に守るルール

- API名は今ある名前を変更しない（`authGetSession` など）
- フロントから直接 Firestore に書き込まない
- 書き込み系 API は必ず「ログイン + isAdmin チェック」
- `createdAt`, `updatedAt` を保存する

## データの場所

- `members/{uid}`
- `settings/grades`
- `settings/presentationTypes`
- `settings/groups`
- `settings/colors`
- `presentations/{id}`
- `events/{id}`
- `teaParties/{id}`

## つまずいたら

- まず `src/index.ts` の export 名と `frontend/src/services/*` の呼び出し名が一致しているか確認
- 型は `src/types/domain.ts` と `src/types/api.ts` を見る
- 1本ずつ実装して `npm run build` で確認

以上。まずは `authGetSession` から着手すればOKです。

実装が終わったらこのファイルは消してね～