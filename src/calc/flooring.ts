export type LayingMethod = 'parallel' | 'diagonal'

export type FlooringInput = {
  readonly roomWidth: number   // m
  readonly roomDepth: number   // m
  readonly boardWidth: number  // mm
  readonly boardLength: number // mm
  readonly layingMethod: LayingMethod
}

export type FlooringResult = {
  readonly floorArea: number         // m²
  readonly boardArea: number         // m² 1枚あたり
  readonly theoreticalCount: number  // 理論枚数
  readonly lossRate: number          // ロス率 (0.05 or 0.10)
  readonly recommendedCount: number  // 推奨枚数（ロス込み）
  readonly supplies: FlooringSupplies
}

export type FlooringSupplies = {
  readonly adhesiveKg: number  // 接着剤(kg)
  readonly adhesiveType: string
}

const LOSS_PARALLEL = 0.05
const LOSS_DIAGONAL = 0.10
const FLOORING_ADHESIVE_KG_PER_M2 = 0.5
const CF_ADHESIVE_KG_PER_M2 = 0.3

export function calculateFlooring(input: FlooringInput): FlooringResult {
  const { roomWidth, roomDepth, boardWidth, boardLength, layingMethod } = input

  const floorArea = round2(roomWidth * roomDepth)
  const boardAreaRaw = (boardWidth / 1000) * (boardLength / 1000)
  const boardArea = round3(boardAreaRaw)

  const theoreticalCount = Math.ceil(floorArea / boardAreaRaw)

  const lossRate = layingMethod === 'parallel' ? LOSS_PARALLEL : LOSS_DIAGONAL
  const recommendedCount = Math.ceil(theoreticalCount * (1 + lossRate))

  // 板サイズで判定: 幅1000mm以上ならCF系（ロール材）、それ以下ならフローリング系（板材）
  const isCF = boardWidth >= 1000
  const adhesivePerM2 = isCF ? CF_ADHESIVE_KG_PER_M2 : FLOORING_ADHESIVE_KG_PER_M2

  const supplies: FlooringSupplies = {
    adhesiveKg: round2(floorArea * adhesivePerM2),
    adhesiveType: isCF ? 'CF用接着剤' : 'フローリング用接着剤',
  }

  return {
    floorArea,
    boardArea,
    theoreticalCount,
    lossRate,
    recommendedCount,
    supplies,
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

function round3(n: number): number {
  return Math.round(n * 1000) / 1000
}
