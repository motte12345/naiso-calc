import { describe, it, expect } from 'vitest'
import { calculateWallpaper } from './wallpaper'
import type { WallpaperInput } from './wallpaper'

describe('calculateWallpaper', () => {
  const baseInput: WallpaperInput = {
    roomWidth: 3.6,
    roomDepth: 2.7,
    roomHeight: 2.4,
    windows: [],
    doors: [],
    wallpaperType: 'domestic',
    patternRepeat: 0,
  }

  it('窓・ドアなし、無地、国産の基本ケース', () => {
    const result = calculateWallpaper(baseInput)

    // 周長 = (3.6 + 2.7) * 2 = 12.6m
    // 壁面積 = 12.6 * 2.4 = 30.24m²
    expect(result.wallArea).toBe(30.24)
    expect(result.openingArea).toBe(0)
    expect(result.effectiveArea).toBe(30.24)

    // 巾数 = ceil(12.6 / 0.92) = ceil(13.69) = 14
    expect(result.stripCount).toBe(14)

    // 1巾 = (2.4*100 + 10) / 100 = 2.5m
    expect(result.stripLength).toBe(2.5)

    // 必要m数 = 14 * 2.5 = 35m
    expect(result.totalLength).toBe(35)

    // ロール数 = ceil(35 / 50) = 1
    expect(result.rollCount).toBe(1)
    expect(result.rollWidthMm).toBe(920)
    expect(result.rollLengthM).toBe(50)
  })

  it('窓・ドアありで開口部を除外する', () => {
    const input: WallpaperInput = {
      ...baseInput,
      windows: [{ width: 1.8, height: 1.2 }],
      doors: [{ width: 0.8, height: 2.0 }],
    }
    const result = calculateWallpaper(input)

    // 開口部 = 1.8*1.2 + 0.8*2.0 = 2.16 + 1.6 = 3.76
    expect(result.openingArea).toBe(3.76)
    expect(result.effectiveArea).toBe(26.48)

    // 副資材は有効面積ベース
    const effectiveArea = 30.24 - 3.76
    expect(result.supplies.glueKg).toBe(Math.round(effectiveArea * 0.15 * 100) / 100)
    expect(result.supplies.puttyKg).toBe(Math.round(effectiveArea * 0.3 * 100) / 100)
  })

  it('輸入壁紙（530mm幅 / 10mロール）', () => {
    const input: WallpaperInput = {
      ...baseInput,
      wallpaperType: 'imported',
    }
    const result = calculateWallpaper(input)

    // 巾数 = ceil(12.6 / 0.53) = ceil(23.77) = 24
    expect(result.stripCount).toBe(24)
    expect(result.rollWidthMm).toBe(530)
    expect(result.rollLengthM).toBe(10)

    // 必要m数 = 24 * 2.5 = 60m
    expect(result.totalLength).toBe(60)

    // ロール数 = ceil(60 / 10) = 6
    expect(result.rollCount).toBe(6)
  })

  it('柄リピートありで切り上げ', () => {
    const input: WallpaperInput = {
      ...baseInput,
      patternRepeat: 64, // 64cmリピート
    }
    const result = calculateWallpaper(input)

    // 基本長 = 2.4*100 + 10 = 250cm
    // ceil(250 / 64) * 64 = 4 * 64 = 256cm = 2.56m
    expect(result.stripLength).toBe(2.56)

    // 必要m数 = 14 * 2.56 = 35.84
    expect(result.totalLength).toBe(35.84)
  })

  it('複数の窓・ドア', () => {
    const input: WallpaperInput = {
      ...baseInput,
      windows: [
        { width: 1.8, height: 1.2 },
        { width: 0.6, height: 0.6 },
      ],
      doors: [
        { width: 0.8, height: 2.0 },
        { width: 0.7, height: 2.0 },
      ],
    }
    const result = calculateWallpaper(input)

    // 開口部 = 1.8*1.2 + 0.6*0.6 + 0.8*2.0 + 0.7*2.0
    //        = 2.16 + 0.36 + 1.6 + 1.4 = 5.52
    expect(result.openingArea).toBe(5.52)
    expect(result.effectiveArea).toBe(30.24 - 5.52)
  })

  it('開口部が壁面積を超えても負にならない', () => {
    const input: WallpaperInput = {
      ...baseInput,
      roomWidth: 1,
      roomDepth: 1,
      roomHeight: 2.4,
      windows: [{ width: 10, height: 10 }],
    }
    const result = calculateWallpaper(input)
    expect(result.effectiveArea).toBe(0)
  })

  it('副資材の計算が正しい', () => {
    const result = calculateWallpaper(baseInput)

    // のり: 30.24 * 0.15 = 4.536 → 4.54
    expect(result.supplies.glueKg).toBe(4.54)
    // パテ: 30.24 * 0.3 = 9.072 → 9.07
    expect(result.supplies.puttyKg).toBe(9.07)
    expect(result.supplies.rollerCount).toBe(1)
  })
})
