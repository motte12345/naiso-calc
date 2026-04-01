# TODO.md — 内装材料カリキュレーター

## Phase 1: 壁紙計算ページで完成形を作る

- [x] プロジェクトスキャフォールド（Vite + React + TS + React Router）
- [x] 共通レイアウトコンポーネント（Header, Footer, Layout）
- [x] 壁紙計算ロジック（純粋関数）
- [x] 壁紙計算ロジックのテスト（7テスト全通過）
- [x] 壁紙計算ページUI
- [x] トップページ（ツール一覧カード）

## Phase 2: 残り3ツール

- [x] 床材計算（ロジック + UI + テスト）— 5テスト通過
- [x] タイル計算（ロジック + UI + テスト）— 5テスト通過
- [x] ペンキ計算（ロジック + UI + テスト）— 6テスト通過
- [x] aboutページ

## Phase 3: SEO・収益化

- [x] SEO補足コンテンツ（全4ツールに使い方・コツのテキスト追加）
- [x] メタタグ・OGP（react-helmet-async、全ページに個別設定）
- [x] アフィリエイトリンク（AffiliateLinksコンポーネント、全4ツールに商品リンク配置）
- [x] デプロイ設定（Cloudflare _redirects / robots.txt）

## Phase 3.5: SSG + SEO強化

- [x] SSGプリレンダリング（全6ページの静的HTML生成）
- [x] JSON-LD構造化データ（WebApplication + BreadcrumbList）
- [x] パンくずリスト（UI + 構造化データ）
- [x] sitemap.xml

## Phase 4: UI/UXデザイン改善

- [x] 計算結果をアフィリエイトの前に表示
- [x] 計算後の自動スクロール
- [x] バリデーションエラー表示
- [x] ヘッダーにツール間ナビゲーション追加
- [x] 最重要数値をコールアウトボックスで強調
- [x] calcButtonスマホ全幅化 + タップターゲット44px以上
- [x] アフィリエイトPR表記（ステマ規制対応）
- [x] 計算結果コピー機能
- [x] フッターに免責リンク
- [x] ヘッダー全幅化（スクロールバーずれ解消）

## Phase 5: 残作業

- [ ] AdSense（アカウント承認後にスクリプトとスロット追加）
- [ ] Amazon/楽天のアフィリエイトタグを実際のIDに差し替え（`YOUR_AMAZON_TAG`）
- [ ] OGP用の画像（og:image）作成・設定
- [ ] PageHeadのBASE_URLを本番ドメインに更新
- [ ] レスポンシブの実機テスト
