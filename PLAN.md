# PLAN.md — 内装材料カリキュレーター 開発計画

## Phase 1: 壁紙計算ページで完成形を作る（現在）

- プロジェクトスキャフォールド（Vite + React + TypeScript + React Router）
- 共通レイアウト・UIコンポーネント設計
- 壁紙計算ロジック実装
- 壁紙計算ページUI実装
- レスポンシブ対応
- トップページ（ツール一覧）

## Phase 2: 残り3ツール追加

- 床材計算ページ
- タイル計算ページ
- ペンキ計算ページ
- aboutページ

## Phase 3: SEO・収益化

- 各ページにSEO用補足コンテンツ追加
- メタタグ・OGP設定
- アフィリエイトリンク組み込み（Amazon/楽天）
- AdSense導入
- Vercel or Cloudflare Pagesデプロイ

## 技術選定

| 項目 | 選定 | 理由 |
|---|---|---|
| フレームワーク | React + Vite | 静的サイトに最適、ビルド高速 |
| 言語 | TypeScript | 計算ロジックの型安全 |
| ルーティング | React Router v7 | SPAの定番 |
| スタイリング | CSS Modules | シンプル、追加依存なし |
| テスト | Vitest | Viteネイティブ、高速 |
| デプロイ | Vercel or Cloudflare Pages | 静的サイト無料枠あり |
