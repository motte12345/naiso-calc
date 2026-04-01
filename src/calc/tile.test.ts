import { describe, it, expect } from 'vitest'
import { calculateTile } from './tile'
import type { TileInput } from './tile'

describe('calculateTile', () => {
  const baseInput: TileInput = {
    surfaceWidth: 1800,   // mm
    surfaceHeight: 900,   // mm
    tileWidth: 100,       // mm
    tileHeight: 100,      // mm
    jointWidth: 3,        // mm
    tileThickness: 7,     // mm
  }

  it('基本ケース', () => {
    const result = calculateTile(baseInput)

    // 横 = ceil(1800 / 103) = ceil(17.48) = 18
    expect(result.horizontalCount).toBe(18)
    // 縦 = ceil(900 / 103) = ceil(8.74) = 9
    expect(result.verticalCount).toBe(9)
    // 必要 = 18 * 9 = 162
    expect(result.requiredCount).toBe(162)
    // 予備込み = ceil(162 * 1.10) = ceil(178.2) = 179
    expect(result.withSpareCount).toBe(179)
    // 施工面積 = 1.8 * 0.9 = 1.62m²
    expect(result.surfaceAreaM2).toBe(1.62)
  })

  it('目地材の計算', () => {
    const result = calculateTile(baseInput)

    // 縦目地延長 = (18-1) * 900 = 15300mm
    // 横目地延長 = (9-1) * 1800 = 14400mm
    // 合計 = 29700mm
    // 体積 = 29700 * 3 * 7 = 623700mm³
    // L = 623700 / 1000000 = 0.6237L
    // kg = 0.6237 * 1.5 = 0.93555 → 0.94
    expect(result.jointMaterialKg).toBe(0.94)
  })

  it('大判タイル（300x600）', () => {
    const input: TileInput = {
      surfaceWidth: 2400,
      surfaceHeight: 1200,
      tileWidth: 300,
      tileHeight: 600,
      jointWidth: 2,
      tileThickness: 9,
    }
    const result = calculateTile(input)

    // 横 = ceil(2400 / 302) = ceil(7.95) = 8
    expect(result.horizontalCount).toBe(8)
    // 縦 = ceil(1200 / 602) = ceil(1.99) = 2
    expect(result.verticalCount).toBe(2)
    expect(result.requiredCount).toBe(16)
    // 予備 = ceil(16 * 1.10) = ceil(17.6) = 18
    expect(result.withSpareCount).toBe(18)
  })

  it('目地幅0の場合', () => {
    const input: TileInput = {
      ...baseInput,
      jointWidth: 0,
    }
    const result = calculateTile(input)

    // 横 = ceil(1800 / 100) = 18
    // 縦 = ceil(900 / 100) = 9
    expect(result.horizontalCount).toBe(18)
    expect(result.verticalCount).toBe(9)
    expect(result.jointMaterialKg).toBe(0)
  })

  it('モザイクタイル（小さいタイル）', () => {
    const input: TileInput = {
      surfaceWidth: 600,
      surfaceHeight: 600,
      tileWidth: 25,
      tileHeight: 25,
      jointWidth: 2,
      tileThickness: 5,
    }
    const result = calculateTile(input)

    // 横 = ceil(600 / 27) = ceil(22.22) = 23
    expect(result.horizontalCount).toBe(23)
    // 縦 = ceil(600 / 27) = ceil(22.22) = 23
    expect(result.verticalCount).toBe(23)
    expect(result.requiredCount).toBe(529)
    // 予備 = ceil(529 * 1.10) = ceil(581.9) = 582
    expect(result.withSpareCount).toBe(582)
  })
})
