# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

DIY・リフォーム用の内装材料計算ツール群（壁紙・床材・タイル・ペンキ）。
静的サイトとして構築し、AdSense + アフィリエイトで収益化予定。

## コマンド

```bash
npm run dev        # 開発サーバー起動（Vite）
npm run build      # TypeScript型チェック + Viteビルド
npm run lint       # ESLint
npm test           # Vitest全テスト実行
npm run test:watch # Vitestウォッチモード
```

単一テストファイル実行: `npx vitest run src/calc/wallpaper.test.ts`

## アーキテクチャ

### 計算ロジックとUIの分離

各計算ツールは **純粋関数（`src/calc/`）** と **ページUI（`src/pages/`）** に分離される。

- `src/calc/<tool>.ts` — 入力型・出力型・計算関数をexport。副作用なし。
- `src/calc/<tool>.test.ts` — 計算ロジックのユニットテスト。
- `src/pages/<Tool>Page.tsx` — フォーム状態管理、計算関数の呼び出し、結果表示。

### 新しい計算ツールの追加パターン

1. `src/calc/<tool>.ts` に入力型・出力型・計算関数を定義
2. `src/calc/<tool>.test.ts` でテスト
3. `src/pages/<Tool>Page.tsx` + `.module.css` でUI作成
4. `src/App.tsx` にRouteを追加
5. `src/pages/HomePage.tsx` のtools配列に追加（`ready: true`に変更）

### 共通コンポーネント

- `Layout` — ヘッダー・フッター・Outlet（React Router）
- `FormField` — ラベル+単位付き入力欄
- `ResultCard` — 計算結果表示カード

### スタイリング

CSS Modules（`.module.css`）を使用。グローバルCSS変数は `src/index.css` の `:root` で定義。

## 計算ロジックの設計方針

- 計算関数は純粋関数。React状態やDOMに依存しない。
- 数値は安全側に丸める（切り上げ: `Math.ceil`）。
- 小数点は `round2()`（小数第2位）で丸める。
- 開口部面積が壁面積を超えても負にならないよう `Math.max(0, ...)` で保護。
- 仕様詳細（係数・ロス率・副資材計算式）は `SPEC.md` に記載。
