# KNOWLEDGE.md — 内装材料カリキュレーター

## 2026-04-01: React 19 + react-helmet-async v3 の SSR コンテキストが機能しない

### 原因
`react-helmet-async` v3 は React 19 を検出すると `React19Dispatcher` を使う。
`React19Dispatcher` は `componentDidMount` ベースの DOM 操作に切り替わるため、
`renderToString()` では `HelmetProvider` の `context.helmet` にデータが格納されない。

### 解決策
`renderToString()` の返り値の先頭に `<title>` と `<meta>` タグが直接含まれる。
これを正規表現で抽出して `<head>` に移動する方式で対応した。

```ts
const HEAD_TAG_PATTERN = /^((?:<(?:title|meta|link|...)...)*/
const { headHtml, bodyHtml } = extractHeadTags(rendered)
```

### 教訓
- `react-helmet-async` の SSR コンテキスト API は React 19 では使えない
- React 19 では Helmet タグが renderToString の出力先頭に直接出力される

---

## 2026-04-01: react-helmet-async の CJS が Node 24 で ERR_REQUIRE_CYCLE_MODULE

### 原因
`react-helmet-async` の CJS ビルド (`lib/index.js`) が内部で `lib/index.esm.js` を
`require()` している。Node 24 では ESM を同期 `require()` するとエラーになる。

### 解決策
Node.js のカスタムローダーフック (`css-mock.js`) で `react-helmet-async` の
import を直接 `lib/index.esm.js` に差し替える。

```js
if (specifier === 'react-helmet-async') {
  return { url: new URL('../node_modules/react-helmet-async/lib/index.esm.js', import.meta.url).href }
}
```

### 教訓
- Node 24 では CJS が ESM を require() するパッケージは壊れる可能性がある
- ローダーフックで直接 ESM パスを指定して回避できる

---

## 2026-04-01: tsx が tsconfig.app.json を認識せず classic JSX に変換してしまう

### 原因
`tsx` はデフォルトで `tsconfig.json` を参照するが、このプロジェクトの
`tsconfig.json` は `files: []` で空のルートファイル（参照だけ）。
`jsx: "react-jsx"` は `tsconfig.app.json` に定義されているため、
`tsx` がそれを見つけられず classic JSX (`React.createElement`) に変換した。

### 解決策
環境変数 `TSX_TSCONFIG_PATH=tsconfig.app.json` を設定して `tsx` に
正しい tsconfig を指示する。`prerender-runner.mjs` で子プロセス起動時に設定。

### 教訓
- `tsx` のデフォルト tsconfig 探索はプロジェクトルートの `tsconfig.json` のみ
- 複数の tsconfig を持つプロジェクトでは `TSX_TSCONFIG_PATH` 必須

---

## 2026-04-01: prerender 2回目実行で dist/index.html が汚染される

### 原因
`npm run build` の prerender ステップで最初に `/` ルートを処理し
`dist/index.html` を上書きする。このファイルを次回のビルドで再度テンプレートとして
読み込むと `<div id="root"></div>` が存在せず置換に失敗する。

### 解決策
`normalizeTemplate()` 関数でテンプレートを読み込んだ直後に正規化する。
- `<div id="root">...</div>` の中身を除去して空に戻す
- 前回挿入済みの `<meta>` / `<link>` 行を `<head>` から除去する

### 教訓
- プリレンダリングは冪等（何度実行しても同じ結果）にする設計が重要
- テンプレートの正規化処理を実行開始時に必ず行う

---

## 2026-04-01: Windows で Node --import に Windows 絶対パスを渡せない

### 原因
`--import E:\work\tm\...` のような Windows 絶対パスは Node.js の ESM ローダーが
`file://` URL スキームを期待するため `ERR_UNSUPPORTED_ESM_URL_SCHEME` が発生する。

### 解決策
`pathToFileURL()` を使って Windows パスを `file:///E:/...` URL に変換してから
`--import` に渡す。

```js
import { pathToFileURL } from 'node:url'
const url = pathToFileURL(absolutePath).href  // "file:///E:/..."
```

### 教訓
- Node.js の `--import` フラグには必ず `file://` URL か相対パスを渡す
- Windows 開発環境では `pathToFileURL()` を忘れずに使う
