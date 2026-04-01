# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

DIY・リフォーム用の内装材料計算ツール群（壁紙・床材・タイル・ペンキ）。
SSG（静的サイト生成）で構築し、Cloudflare Pagesにデプロイ。AdSense + Amazon/楽天アフィリエイトで収益化予定。

## コマンド

```bash
npm run dev        # 開発サーバー起動（Vite）
npm run build      # TypeScript型チェック + Viteビルド + SSGプリレンダリング（全6ページ）
npm run lint       # ESLint
npm test           # Vitest全テスト実行（23テスト）
npm run test:watch # Vitestウォッチモード
```

単一テストファイル実行: `npx vitest run src/calc/wallpaper.test.ts`

## アーキテクチャ

### 計算ロジックとUIの分離

各計算ツールは **純粋関数（`src/calc/`）** と **ページUI（`src/pages/`）** に分離される。

- `src/calc/<tool>.ts` — 入力型・出力型・計算関数をexport。副作用なし。
- `src/calc/<tool>.test.ts` — 計算ロジックのユニットテスト。
- `src/pages/<Tool>Page.tsx` — フォーム状態管理、計算関数の呼び出し、結果表示。
- `src/calc/types.ts` — 共通型（`Opening`等）。

### SSGプリレンダリング

ビルド時に `scripts/prerender.ts` が全6ルートの静的HTMLを生成する。

- `react-dom/server` + `StaticRouter` で各ルートをレンダリング
- `react-helmet-async` のタグを `<head>` に注入（React 19対応: 出力先頭から抽出方式）
- `scripts/css-mock.js` — Node.jsカスタムローダー（CSS Modules/アセットをモック）
- `scripts/register-hooks.js` — ローダーフック登録
- `scripts/prerender-runner.mjs` — Windows対応のエントリポイント（`TSX_TSCONFIG_PATH`設定）

### 新しい計算ツールの追加パターン

1. `src/calc/<tool>.ts` に入力型・出力型・計算関数を定義
2. `src/calc/<tool>.test.ts` でテスト
3. `src/pages/<Tool>Page.tsx` でUI作成（共通CSS: `CalculatorPage.module.css`）
4. `src/App.tsx` にRouteを追加
5. `src/pages/HomePage.tsx` のtools配列に追加
6. `scripts/prerender.ts` のROUTES配列にパスを追加

### 共通コンポーネント

- `Layout` — ヘッダー（ナビ付き）・フッター・Outlet（React Router）
- `FormField` — ラベル+単位付き入力欄
- `ResultCard` — 計算結果表示カード
- `PageHead` — ページ別title/description/OGP（react-helmet-async）
- `Breadcrumb` — パンくずリスト（UI + JSON-LD構造化データ）
- `StructuredData` — WebApplication JSON-LD
- `AffiliateLinks` — Amazon/楽天アフィリエイトリンク（PR表記付き）
- `CopyResultButton` — 計算結果をクリップボードにコピー
- `SeoContent` — SEO用の補足テキストセクション

### 各計算ページの共通構造

```
PageHead → StructuredData → Breadcrumb → h1 → 説明文
→ フォーム（バリデーションエラー表示付き）
→ 計算結果（calloutで最重要数値 + ResultCard + CopyButton + 免責テキスト）
→ AffiliateLinks
→ SeoContent
```

### スタイリング

CSS Modules（`.module.css`）を使用。グローバルCSS変数は `src/index.css` の `:root` で定義。
計算ページは共通の `CalculatorPage.module.css` を使用。

## 計算ロジックの設計方針

- 計算関数は純粋関数。React状態やDOMに依存しない。
- 数値は安全側に丸める（切り上げ: `Math.ceil`）。
- 小数点は `round2()`（小数第2位）で丸める。
- 表示用の丸め値と計算用の生の値を区別する（flooringのboardArea参照）。
- 開口部面積が壁面積を超えても負にならないよう `Math.max(0, ...)` で保護。
- 仕様詳細（係数・ロス率・副資材計算式）は `SPEC.md` に記載。

## デプロイ

- Cloudflare Pages（GitHub連携、mainブランチにpushで自動デプロイ）
- Build command: `npm run build`
- Build output: `dist`
- SPA用リダイレクト: `public/_redirects`
