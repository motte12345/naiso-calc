import { describe, it, expect } from 'vitest'
import { calculateFlooring } from './flooring'
import type { FlooringInput } from './flooring'

describe('calculateFlooring', () => {
  const baseInput: FlooringInput = {
    roomWidth: 3.6,
    roomDepth: 2.7,
    boardWidth: 150,    // mm（フローリング）
    boardLength: 900,   // mm
    layingMethod: 'parallel',
  }

  it('並行貼り基本ケース', () => {
    const result = calculateFlooring(baseInput)

    // 床面積 = 3.6 * 2.7 = 9.72m²
    expect(result.floorArea).toBe(9.72)
    // 1枚面積(表示) = round3(0.15 * 0.9) = 0.135
    expect(result.boardArea).toBe(0.135)
    // 理論枚数: ceil(9.72 / 0.135) = ceil(72) = 72
    expect(result.theoreticalCount).toBe(72)
    // ロス率 5%
    expect(result.lossRate).toBe(0.05)
    // 推奨 = ceil(72 * 1.05) = ceil(75.6) = 76
    expect(result.recommendedCount).toBe(76)
    // 接着剤: フローリング用（幅150mm < 1000mm）9.72 * 0.5 = 4.86kg
    expect(result.supplies.adhesiveKg).toBe(4.86)
    expect(result.supplies.adhesiveType).toBe('フローリング用接着剤')
  })

  it('斜め貼りでロス率10%', () => {
    const input: FlooringInput = { ...baseInput, layingMethod: 'diagonal' }
    const result = calculateFlooring(input)

    expect(result.lossRate).toBe(0.10)
    // 推奨 = ceil(72 * 1.10) = ceil(79.2) = 80
    expect(result.recommendedCount).toBe(80)
  })

  it('CF（幅1000mm以上）で接着剤タイプ変更', () => {
    const input: FlooringInput = {
      ...baseInput,
      boardWidth: 1820,   // mm（CF）
      boardLength: 900,
    }
    const result = calculateFlooring(input)

    expect(result.supplies.adhesiveType).toBe('CF用接着剤')
    // CF接着剤: 9.72 * 0.3 = 2.916 → 2.92
    expect(result.supplies.adhesiveKg).toBe(2.92)
  })

  it('303mm幅フローリングはフローリング用接着剤', () => {
    const input: FlooringInput = {
      roomWidth: 3.6,
      roomDepth: 2.7,
      boardWidth: 303,
      boardLength: 1818,
      layingMethod: 'parallel',
    }
    const result = calculateFlooring(input)

    // 303mm < 1000mm なのでフローリング用
    expect(result.supplies.adhesiveType).toBe('フローリング用接着剤')
    // 1枚面積(表示) = round3(0.303 * 1.818) = 0.551
    expect(result.boardArea).toBe(0.551)
    // 理論 = ceil(9.72 / 0.550854) = ceil(17.646) = 18
    expect(result.theoreticalCount).toBe(18)
    // 推奨 = ceil(18 * 1.05) = ceil(18.9) = 19
    expect(result.recommendedCount).toBe(19)
  })

  it('小さい板サイズで枚数が増える', () => {
    const input: FlooringInput = {
      ...baseInput,
      boardWidth: 100,
      boardLength: 200,
    }
    const result = calculateFlooring(input)

    // 1枚 = 0.1 * 0.2 = 0.02m²
    expect(result.boardArea).toBe(0.02)
    // 理論 = ceil(9.72 / 0.02) = 486
    expect(result.theoreticalCount).toBe(486)
    // 推奨 = ceil(486 * 1.05) = ceil(510.3) = 511
    expect(result.recommendedCount).toBe(511)
  })
})
