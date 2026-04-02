/**
 * OGP画像生成スクリプト
 * 1200x630px の PNG を public/ogp.png に出力
 */
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT_PATH = join(__dirname, '..', 'public', 'ogp.png')

const WIDTH = 1200
const HEIGHT = 630

// サイトのカラースキームに合わせたデザイン
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4F8A5E"/>
      <stop offset="100%" stop-color="#3d6d49"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff9800"/>
      <stop offset="100%" stop-color="#ffa726"/>
    </linearGradient>
  </defs>

  <!-- 背景 -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>

  <!-- 装飾パターン（グリッド線で内装・DIY感を演出） -->
  <g opacity="0.08" stroke="#ffffff" stroke-width="1" fill="none">
    ${Array.from({ length: 12 }, (_, i) => `<line x1="${i * 100}" y1="0" x2="${i * 100}" y2="${HEIGHT}"/>`).join('\n    ')}
    ${Array.from({ length: 7 }, (_, i) => `<line x1="0" y1="${i * 100}" x2="${WIDTH}" y2="${i * 100}"/>`).join('\n    ')}
  </g>

  <!-- 装飾：角の三角形 -->
  <polygon points="0,0 200,0 0,200" fill="#ffffff" opacity="0.05"/>
  <polygon points="${WIDTH},${HEIGHT} ${WIDTH - 200},${HEIGHT} ${WIDTH},${HEIGHT - 200}" fill="#ffffff" opacity="0.05"/>

  <!-- 4つのツールアイコン -->
  <g transform="translate(100, 180)" opacity="0.15">
    <!-- 壁紙ロール -->
    <rect x="0" y="0" width="60" height="80" rx="8" fill="#ffffff"/>
    <rect x="10" y="10" width="40" height="60" rx="4" fill="none" stroke="#ffffff" stroke-width="2"/>
    <!-- 床板 -->
    <rect x="100" y="20" width="70" height="50" rx="4" fill="#ffffff"/>
    <line x1="120" y1="20" x2="120" y2="70" stroke="url(#bg)" stroke-width="2"/>
    <line x1="150" y1="20" x2="150" y2="70" stroke="url(#bg)" stroke-width="2"/>
    <!-- タイル -->
    <rect x="210" y="10" width="30" height="30" rx="2" fill="#ffffff"/>
    <rect x="245" y="10" width="30" height="30" rx="2" fill="#ffffff"/>
    <rect x="210" y="45" width="30" height="30" rx="2" fill="#ffffff"/>
    <rect x="245" y="45" width="30" height="30" rx="2" fill="#ffffff"/>
    <!-- ペンキ缶 -->
    <rect x="320" y="15" width="50" height="55" rx="6" fill="#ffffff"/>
    <rect x="330" y="5" width="30" height="15" rx="3" fill="#ffffff"/>
  </g>

  <!-- メインタイトル -->
  <text x="${WIDTH / 2}" y="270" text-anchor="middle"
        font-family="'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif"
        font-size="72" font-weight="bold" fill="#ffffff"
        letter-spacing="4">内装材料カリキュレーター</text>

  <!-- アクセントライン -->
  <rect x="${WIDTH / 2 - 60}" y="300" width="120" height="4" rx="2" fill="url(#accent)"/>

  <!-- サブタイトル -->
  <text x="${WIDTH / 2}" y="370" text-anchor="middle"
        font-family="'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif"
        font-size="28" fill="#ffffff" opacity="0.9">壁紙・床材・タイル・ペンキの必要量を簡単計算</text>

  <!-- 下部のキャッチ -->
  <g transform="translate(0, ${HEIGHT - 110})">
    <rect x="0" y="0" width="${WIDTH}" height="110" fill="#000000" opacity="0.15"/>
    <text x="${WIDTH / 2}" y="45" text-anchor="middle"
          font-family="'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif"
          font-size="22" fill="#ffffff" opacity="0.8">DIY・リフォームの材料計算を無料でサポート</text>
    <text x="${WIDTH / 2}" y="80" text-anchor="middle"
          font-family="'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif"
          font-size="18" fill="#ffffff" opacity="0.5">naiso-calc.pages.dev</text>
  </g>
</svg>
`

const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer()
await sharp(pngBuffer).toFile(OUTPUT_PATH)

console.log(`OGP image generated: ${OUTPUT_PATH}`)
