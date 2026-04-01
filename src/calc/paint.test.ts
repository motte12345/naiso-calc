import { describe, it, expect } from 'vitest'
import { calculatePaint } from './paint'
import type { PaintInput } from './paint'

describe('calculatePaint', () => {
  it('直接入力・2回塗り', () => {
    const input: PaintInput = {
      mode: 'direct',
      directArea: 30,
      coatCount: 2,
    }
    const result = calculatePaint(input)

    expect(result.paintArea).toBe(30)
    // 1回 = 30 / 8 = 3.75L
    expect(result.litersPerCoat).toBe(3.75)
    // 合計 = 3.75 * 2 = 7.5L
    expect(result.totalLiters).toBe(7.5)

    // 缶サイズ
    expect(result.cans[0]).toEqual({ label: '0.7L缶', liters: 0.7, count: 11 })
    expect(result.cans[1]).toEqual({ label: '1.6L缶', liters: 1.6, count: 5 })
    expect(result.cans[2]).toEqual({ label: '4L缶', liters: 4, count: 2 })
  })

  it('部屋寸法入力・窓ドア除外', () => {
    const input: PaintInput = {
      mode: 'room',
      roomWidth: 3.6,
      roomDepth: 2.7,
      roomHeight: 2.4,
      windows: [{ width: 1.8, height: 1.2 }],
      doors: [{ width: 0.8, height: 2.0 }],
      coatCount: 2,
    }
    const result = calculatePaint(input)

    // 壁面積 = (3.6+2.7)*2*2.4 = 30.24
    // 開口部 = 1.8*1.2 + 0.8*2.0 = 2.16 + 1.6 = 3.76
    // 有効 = 30.24 - 3.76 = 26.48
    expect(result.paintArea).toBe(26.48)
    // 1回 = 26.48 / 8 = 3.31L
    expect(result.litersPerCoat).toBe(3.31)
    // 合計 = 3.31 * 2 = 6.62L
    expect(result.totalLiters).toBe(6.62)
  })

  it('1回塗り', () => {
    const input: PaintInput = {
      mode: 'direct',
      directArea: 20,
      coatCount: 1,
    }
    const result = calculatePaint(input)

    expect(result.totalLiters).toBe(2.5)
    // 0.7L缶 = ceil(2.5/0.7) = 4
    expect(result.cans[0].count).toBe(4)
  })

  it('3回塗り', () => {
    const input: PaintInput = {
      mode: 'direct',
      directArea: 20,
      coatCount: 3,
    }
    const result = calculatePaint(input)

    // 1回 = 2.5, 合計 = 7.5
    expect(result.totalLiters).toBe(7.5)
  })

  it('部屋寸法で副資材計算', () => {
    const input: PaintInput = {
      mode: 'room',
      roomWidth: 3.6,
      roomDepth: 2.7,
      roomHeight: 2.4,
      coatCount: 2,
    }
    const result = calculatePaint(input)

    // マスキングテープ = (3.6+2.7)*2 * 2 = 12.6 * 2 = 25.2m
    expect(result.supplies.maskingTapeM).toBe(25.2)
    expect(result.supplies.rollerSets).toBe(1)
    // 養生シート = 3.6 * 2.7 = 9.72m²
    expect(result.supplies.dropSheetM2).toBe(9.72)
  })

  it('面積0でも壊れない', () => {
    const input: PaintInput = {
      mode: 'direct',
      directArea: 0,
      coatCount: 2,
    }
    const result = calculatePaint(input)

    expect(result.paintArea).toBe(0)
    expect(result.totalLiters).toBe(0)
  })
})
