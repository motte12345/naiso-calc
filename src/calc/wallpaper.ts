import type { Opening } from './types'

export type { Opening }

export type WallpaperType = 'domestic' | 'imported'

export type WallpaperInput = {
  readonly roomWidth: number   // m
  readonly roomDepth: number   // m
  readonly roomHeight: number  // m
  readonly windows: readonly Opening[]
  readonly doors: readonly Opening[]
  readonly wallpaperType: WallpaperType
  readonly patternRepeat: number // cm（0 = 無地）
}

export type WallpaperResult = {
  readonly wallArea: number           // m² 壁面積（総）
  readonly openingArea: number        // m² 開口部面積
  readonly effectiveArea: number      // m² 有効面積
  readonly stripCount: number         // 巾数
  readonly stripLength: number        // m 1巾あたりの長さ
  readonly totalLength: number        // m 必要m数
  readonly rollCount: number          // ロール数
  readonly rollWidthMm: number        // mm ロール幅
  readonly rollLengthM: number        // m 1ロールの長さ
  readonly supplies: WallpaperSupplies
}

export type WallpaperSupplies = {
  readonly glueKg: number       // のり（kg）
  readonly puttyKg: number      // パテ（kg）
  readonly rollerCount: number  // ジョイントローラー
}

const DOMESTIC_WIDTH_MM = 920
const DOMESTIC_ROLL_LENGTH_M = 50
const IMPORTED_WIDTH_MM = 530
const IMPORTED_ROLL_LENGTH_M = 10

const GLUE_KG_PER_M2 = 0.15
const PUTTY_KG_PER_M2 = 0.3

export function calculateWallpaper(input: WallpaperInput): WallpaperResult {
  const { roomWidth, roomDepth, roomHeight, windows, doors, wallpaperType, patternRepeat } = input

  const perimeter = (roomWidth + roomDepth) * 2
  const wallArea = perimeter * roomHeight

  const openingArea = [...windows, ...doors].reduce(
    (sum, o) => sum + o.width * o.height,
    0,
  )

  const effectiveArea = Math.max(0, wallArea - openingArea)

  const rollWidthMm = wallpaperType === 'domestic' ? DOMESTIC_WIDTH_MM : IMPORTED_WIDTH_MM
  const rollLengthM = wallpaperType === 'domestic' ? DOMESTIC_ROLL_LENGTH_M : IMPORTED_ROLL_LENGTH_M
  const rollWidthM = rollWidthMm / 1000

  // 巾数 = 周長 ÷ ロール幅（切り上げ）
  // ただし開口部の幅分を考慮せず周長全体で計算（安全側）
  const stripCount = Math.ceil(perimeter / rollWidthM)

  // 1巾あたりの長さ = 部屋の高さ（+ 上下の切りしろ5cm×2 = 10cm）
  // 柄リピートがある場合はリピート単位で切り上げ
  const baseLengthCm = roomHeight * 100 + 10 // cm
  const repeatCm = patternRepeat > 0 ? patternRepeat : 0
  const stripLengthCm = repeatCm > 0
    ? Math.ceil(baseLengthCm / repeatCm) * repeatCm
    : baseLengthCm
  const stripLength = stripLengthCm / 100 // m

  const totalLength = stripCount * stripLength

  const rollCount = Math.ceil(totalLength / rollLengthM)

  const supplies: WallpaperSupplies = {
    glueKg: round2(effectiveArea * GLUE_KG_PER_M2),
    puttyKg: round2(effectiveArea * PUTTY_KG_PER_M2),
    rollerCount: 1,
  }

  return {
    wallArea: round2(wallArea),
    openingArea: round2(openingArea),
    effectiveArea: round2(effectiveArea),
    stripCount,
    stripLength: round2(stripLength),
    totalLength: round2(totalLength),
    rollCount,
    rollWidthMm,
    rollLengthM,
    supplies,
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}
