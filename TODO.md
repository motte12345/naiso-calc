# TODO.md — 内装材料カリキュレーター

## Phase 1: 壁紙計算ページで完成形を作る

- [x] プロジェクトスキャフォールド（Vite + React + TS + React Router）
- [x] 共通レイアウトコンポーネント（Header, Footer, Layout）
- [x] 壁紙計算ロジック（純粋関数）
- [x] 壁紙計算ロジックのテスト（7テスト全通過）
- [x] 壁紙計算ページUI
- [x] トップページ（ツール一覧カード）
- [ ] レスポンシブ対応確認（実機テスト）

## Phase 2: 残り3ツール

- [x] 床材計算（ロジック + UI + テスト）— 5テスト通過
- [x] タイル計算（ロジック + UI + テスト）— 5テスト通過
- [x] ペンキ計算（ロジック + UI + テスト）— 6テスト通過
- [x] aboutページ

## Phase 3.5: SSG（静的サイト生成）

- [x] tsx をdevDependenciesにインストール
- [x] scripts/prerender.ts を作成
- [x] scripts/css-mock.js (ローダーフック) を作成
- [x] scripts/register-hooks.js (register() API ラッパー) を作成
- [x] scripts/prerender-runner.mjs (Windows対応 env設定ラッパー) を作成
- [x] package.json の build スクリプトを更新
- [x] ビルド動作確認（npm run build 成功、全6ページ生成確認）

## Phase 3: SEO・収益化

- [x] SEO補足コンテンツ（全4ツールに使い方・コツのテキスト追加）
- [x] メタタグ・OGP（react-helmet-async、全ページに個別設定）
- [x] アフィリエイトリンク（AffiliateLinksコンポーネント、全4ツールに商品リンク配置）
- [x] デプロイ設定（Vercel rewrites / Cloudflare _redirects / robots.txt）
- [ ] AdSense（アカウント承認後にスクリプトとスロット追加）

## 残作業

- [ ] Amazon/楽天のアフィリエイトタグを実際のIDに差し替え（`YOUR_AMAZON_TAG`）
- [ ] Cloudflare Pagesドメイン確定後に`PageHead`の`BASE_URL`を更新
- [ ] OGP用の画像（og:image）作成・設定
- [ ] sitemap.xml生成
- [ ] レスポンシブ対応の実機テスト
