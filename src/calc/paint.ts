import type { Opening } from './types'

export type { Opening }

export type PaintInputMode = 'direct' | 'room'

export type PaintInput = {
  readonly mode: PaintInputMode
  readonly directArea?: number      // m²（直接入力時）
  readonly roomWidth?: number       // m（部屋寸法時）
  readonly roomDepth?: number       // m
  readonly roomHeight?: number      // m
  readonly windows?: readonly Opening[]
  readonly doors?: readonly Opening[]
  readonly coatCount: number        // 塗り回数（1〜3）
}

export type CanSize = {
  readonly label: string
  readonly liters: number
  readonly count: number
}

export type PaintResult = {
  readonly paintArea: number           // m² 塗装面積
  readonly litersPerCoat: number       // L/回
  readonly totalLiters: number         // L 合計
  readonly cans: readonly CanSize[]    // 缶サイズ別
  readonly supplies: PaintSupplies
}

export type PaintSupplies = {
  readonly maskingTapeM: number    // マスキングテープ(m)
  readonly rollerSets: number      // ローラーセット
  readonly dropSheetM2: number     // 養生シート(m²)
}

const COVERAGE_M2_PER_L = 8 // 水性塗料の標準塗布面積
const CAN_SIZES = [
  { label: '0.7L缶', liters: 0.7 },
  { label: '1.6L缶', liters: 1.6 },
  { label: '4L缶', liters: 4 },
] as const

export function calculatePaint(input: PaintInput): PaintResult {
  const { mode, coatCount } = input

  let paintArea: number

  if (mode === 'direct') {
    paintArea = input.directArea ?? 0
  } else {
    const w = input.roomWidth ?? 0
    const d = input.roomDepth ?? 0
    const h = input.roomHeight ?? 0
    const perimeter = (w + d) * 2
    const wallArea = perimeter * h

    const openings = [...(input.windows ?? []), ...(input.doors ?? [])]
    const openingArea = openings.reduce((sum, o) => sum + o.width * o.height, 0)

    paintArea = Math.max(0, wallArea - openingArea)
  }

  paintArea = round2(paintArea)

  const litersPerCoat = round2(paintArea / COVERAGE_M2_PER_L)
  const totalLiters = round2(litersPerCoat * coatCount)

  const cans: readonly CanSize[] = CAN_SIZES.map(size => ({
    label: size.label,
    liters: size.liters,
    count: Math.ceil(totalLiters / size.liters),
  }))

  // 副資材
  const roomWidth = input.roomWidth ?? 0
  const roomDepth = input.roomDepth ?? 0
  const perimeter = mode === 'room' ? (roomWidth + roomDepth) * 2 : 0
  const floorArea = mode === 'room' ? roomWidth * roomDepth : 0

  const supplies: PaintSupplies = {
    maskingTapeM: round2(perimeter > 0 ? perimeter * coatCount : paintArea * 0.5),
    rollerSets: 1,
    dropSheetM2: round2(floorArea > 0 ? floorArea : paintArea * 0.3),
  }

  return {
    paintArea,
    litersPerCoat,
    totalLiters,
    cans,
    supplies,
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}
