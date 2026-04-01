export type TileInput = {
  readonly surfaceWidth: number   // mm
  readonly surfaceHeight: number  // mm
  readonly tileWidth: number      // mm
  readonly tileHeight: number     // mm
  readonly jointWidth: number     // mm
  readonly tileThickness: number  // mm（デフォルト7）
}

export type TileResult = {
  readonly horizontalCount: number   // 横枚数
  readonly verticalCount: number     // 縦枚数
  readonly requiredCount: number     // 必要枚数
  readonly withSpareCount: number    // 予備込み（+10%）
  readonly jointMaterialKg: number   // 目地材(kg)
  readonly surfaceAreaM2: number     // 施工面積(m²)
}

const SPARE_RATE = 0.10
const JOINT_MATERIAL_DENSITY = 1.5 // kg/L

export function calculateTile(input: TileInput): TileResult {
  const { surfaceWidth, surfaceHeight, tileWidth, tileHeight, jointWidth, tileThickness } = input

  const horizontalCount = Math.ceil(surfaceWidth / (tileWidth + jointWidth))
  const verticalCount = Math.ceil(surfaceHeight / (tileHeight + jointWidth))

  const requiredCount = horizontalCount * verticalCount
  const withSpareCount = Math.ceil(requiredCount * (1 + SPARE_RATE))

  // 目地材体積の計算
  // タイル間の目地のみ（外周の壁際は目地なし）
  // 縦目地: (横枚数 - 1) 本 × 施工高さ
  // 横目地: (縦枚数 - 1) 本 × 施工幅
  const verticalJointLength = (horizontalCount - 1) * surfaceHeight // mm
  const horizontalJointLength = (verticalCount - 1) * surfaceWidth  // mm
  const totalJointLength = verticalJointLength + horizontalJointLength // mm

  const jointVolumeMm3 = totalJointLength * jointWidth * tileThickness
  const jointVolumeL = jointVolumeMm3 / 1_000_000 // mm³ → L (1L = 1,000,000 mm³)
  const jointMaterialKg = round2(jointVolumeL * JOINT_MATERIAL_DENSITY)

  const surfaceAreaM2 = round2((surfaceWidth / 1000) * (surfaceHeight / 1000))

  return {
    horizontalCount,
    verticalCount,
    requiredCount,
    withSpareCount,
    jointMaterialKg,
    surfaceAreaM2,
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}
