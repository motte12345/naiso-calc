# PLAN.md — 内装材料カリキュレーター 開発計画

## Phase 1: 壁紙計算ページで完成形を作る ✅

- プロジェクトスキャフォールド（Vite + React + TypeScript + React Router）
- 共通レイアウト・UIコンポーネント設計
- 壁紙計算ロジック実装
- 壁紙計算ページUI実装
- レスポンシブ対応
- トップページ（ツール一覧）

## Phase 2: 残り3ツール追加 ✅

- 床材計算ページ
- タイル計算ページ
- ペンキ計算ページ
- aboutページ

## Phase 3: SEO・収益化 ✅（AdSense除く）

- 各ページにSEO用補足コンテンツ追加
- メタタグ・OGP設定（react-helmet-async）
- アフィリエイトリンク組み込み（Amazon/楽天）
- Cloudflare Pagesデプロイ（GitHub連携）

## Phase 3.5: SSG + SEO強化 ✅

- SSGプリレンダリング（全6ページの静的HTML生成）
- JSON-LD構造化データ（WebApplication + BreadcrumbList）
- パンくずリスト
- sitemap.xml

## Phase 4: UI/UXデザイン改善 ✅

- 計算結果の表示順序修正（アフィリエイトの前に移動）
- 計算後の自動スクロール
- バリデーションエラー表示
- ヘッダーにツール間ナビゲーション追加
- 最重要数値をコールアウトボックスで強調
- 計算ボタンのスマホ全幅化
- タップターゲット拡大（44px以上）
- アフィリエイトPR表記（ステマ規制対応）
- 計算結果のクリップボードコピー機能
- フッターに免責リンク

## Phase 5: 残作業

- AdSense（アカウント承認後にスクリプトとスロット追加）
- Amazon/楽天のアフィリエイトタグを実際のIDに差し替え
- OGP用の画像（og:image）作成・設定
- PageHeadのBASE_URLを本番ドメインに更新
- レスポンシブの実機テスト

## 技術選定

| 項目 | 選定 | 理由 |
|---|---|---|
| フレームワーク | React + Vite | 静的サイトに最適、ビルド高速 |
| 言語 | TypeScript | 計算ロジックの型安全 |
| ルーティング | React Router v7 | SPAの定番 |
| SSG | カスタムprerender | 6ページ固定なので軽量に |
| スタイリング | CSS Modules | シンプル、追加依存なし |
| テスト | Vitest | Viteネイティブ、高速 |
| デプロイ | Cloudflare Pages | 静的サイト無料枠、GitHub連携 |
