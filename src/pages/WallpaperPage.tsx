import { useState } from 'react'
import { FormField } from '../components/FormField'
import { ResultCard } from '../components/ResultCard'
import { PageHead } from '../components/PageHead'
import { AffiliateLinks } from '../components/AffiliateLinks'
import type { AffiliateItem } from '../components/AffiliateLinks'
import { SeoContent } from '../components/SeoContent'
import { calculateWallpaper } from '../calc/wallpaper'
import type { WallpaperType, WallpaperResult, Opening } from '../calc/wallpaper'
import styles from './CalculatorPage.module.css'

const affiliateItems: readonly AffiliateItem[] = [
  { name: '壁紙用のり', description: 'フリース壁紙・ビニルクロスに。粉のりタイプが経済的。', amazonKeyword: '壁紙 のり DIY', rakutenKeyword: '壁紙 のり DIY' },
  { name: '壁紙用パテ', description: '下地の凹凸を埋めて仕上がりをきれいに。', amazonKeyword: '壁紙 パテ 下地処理', rakutenKeyword: '壁紙 パテ 下地処理' },
  { name: 'ジョイントローラー', description: '継ぎ目を圧着してきれいに仕上げる。', amazonKeyword: '壁紙 ジョイントローラー', rakutenKeyword: '壁紙 ジョイントローラー' },
  { name: '壁紙施工道具セット', description: 'ヘラ・カッター・ローラーなど必要な道具一式。', amazonKeyword: '壁紙 施工 道具セット DIY', rakutenKeyword: '壁紙 施工 道具セット DIY' },
]

type OpeningInput = {
  readonly width: string
  readonly height: string
}

const EMPTY_OPENING: OpeningInput = { width: '', height: '' }

export function WallpaperPage() {
  const [roomWidth, setRoomWidth] = useState('')
  const [roomDepth, setRoomDepth] = useState('')
  const [roomHeight, setRoomHeight] = useState('2.4')
  const [wallpaperType, setWallpaperType] = useState<WallpaperType>('domestic')
  const [patternRepeat, setPatternRepeat] = useState('')
  const [windows, setWindows] = useState<readonly OpeningInput[]>([])
  const [doors, setDoors] = useState<readonly OpeningInput[]>([])
  const [result, setResult] = useState<WallpaperResult | null>(null)

  function addWindow() {
    setWindows([...windows, EMPTY_OPENING])
  }

  function removeWindow(index: number) {
    setWindows(windows.filter((_, i) => i !== index))
  }

  function updateWindow(index: number, field: keyof OpeningInput, value: string) {
    setWindows(windows.map((w, i) => i === index ? { ...w, [field]: value } : w))
  }

  function addDoor() {
    setDoors([...doors, EMPTY_OPENING])
  }

  function removeDoor(index: number) {
    setDoors(doors.filter((_, i) => i !== index))
  }

  function updateDoor(index: number, field: keyof OpeningInput, value: string) {
    setDoors(doors.map((d, i) => i === index ? { ...d, [field]: value } : d))
  }

  function parseOpenings(inputs: readonly OpeningInput[]): readonly Opening[] {
    return inputs
      .map(o => ({
        width: parseFloat(o.width) || 0,
        height: parseFloat(o.height) || 0,
      }))
      .filter(o => o.width > 0 && o.height > 0)
  }

  function handleCalculate() {
    const w = parseFloat(roomWidth)
    const d = parseFloat(roomDepth)
    const h = parseFloat(roomHeight)

    if (!w || !d || !h || w <= 0 || d <= 0 || h <= 0) {
      return
    }

    const calculated = calculateWallpaper({
      roomWidth: w,
      roomDepth: d,
      roomHeight: h,
      windows: parseOpenings(windows),
      doors: parseOpenings(doors),
      wallpaperType,
      patternRepeat: parseFloat(patternRepeat) || 0,
    })

    setResult(calculated)
  }

  return (
    <div className={styles.page}>
      <PageHead
        title="壁紙（クロス）必要量計算"
        description="部屋の寸法から壁紙の必要m数・ロール数を自動計算。窓やドアの除外、国産・輸入壁紙の切替、柄リピートによるロス加算に対応。"
        path="/wallpaper"
      />
      <h1 className={styles.title}>壁紙（クロス）必要量計算</h1>
      <p className={styles.description}>
        部屋の寸法と窓・ドアのサイズを入力して、必要な壁紙の量を計算します。
        柄リピートによるロス分も自動で加算されます。
      </p>

      <section className={styles.form}>
        <h2 className={styles.sectionTitle}>部屋の寸法</h2>
        <div className={styles.grid3}>
          <FormField label="幅" unit="m">
            <input
              type="number"
              value={roomWidth}
              onChange={e => setRoomWidth(e.target.value)}
              placeholder="3.6"
              min="0"
              step="0.1"
            />
          </FormField>
          <FormField label="奥行" unit="m">
            <input
              type="number"
              value={roomDepth}
              onChange={e => setRoomDepth(e.target.value)}
              placeholder="2.7"
              min="0"
              step="0.1"
            />
          </FormField>
          <FormField label="高さ" unit="m">
            <input
              type="number"
              value={roomHeight}
              onChange={e => setRoomHeight(e.target.value)}
              placeholder="2.4"
              min="0"
              step="0.1"
            />
          </FormField>
        </div>

        <h2 className={styles.sectionTitle}>壁紙の種類</h2>
        <div className={styles.grid2}>
          <FormField label="壁紙タイプ">
            <select
              value={wallpaperType}
              onChange={e => setWallpaperType(e.target.value as WallpaperType)}
            >
              <option value="domestic">国産（幅920mm / 50mロール）</option>
              <option value="imported">輸入（幅530mm / 10mロール）</option>
            </select>
          </FormField>
          <FormField label="柄リピート" unit="cm">
            <input
              type="number"
              value={patternRepeat}
              onChange={e => setPatternRepeat(e.target.value)}
              placeholder="0（無地）"
              min="0"
              step="1"
            />
          </FormField>
        </div>

        <h2 className={styles.sectionTitle}>
          窓
          <button type="button" className={styles.addButton} onClick={addWindow}>
            + 追加
          </button>
        </h2>
        {windows.map((w, i) => (
          <div key={i} className={styles.openingRow}>
            <span className={styles.openingLabel}>窓{i + 1}</span>
            <FormField label="幅" unit="m">
              <input
                type="number"
                value={w.width}
                onChange={e => updateWindow(i, 'width', e.target.value)}
                placeholder="1.8"
                min="0"
                step="0.1"
              />
            </FormField>
            <FormField label="高さ" unit="m">
              <input
                type="number"
                value={w.height}
                onChange={e => updateWindow(i, 'height', e.target.value)}
                placeholder="1.2"
                min="0"
                step="0.1"
              />
            </FormField>
            <button
              type="button"
              className={styles.removeButton}
              onClick={() => removeWindow(i)}
            >
              削除
            </button>
          </div>
        ))}

        <h2 className={styles.sectionTitle}>
          ドア
          <button type="button" className={styles.addButton} onClick={addDoor}>
            + 追加
          </button>
        </h2>
        {doors.map((d, i) => (
          <div key={i} className={styles.openingRow}>
            <span className={styles.openingLabel}>ドア{i + 1}</span>
            <FormField label="幅" unit="m">
              <input
                type="number"
                value={d.width}
                onChange={e => updateDoor(i, 'width', e.target.value)}
                placeholder="0.8"
                min="0"
                step="0.1"
              />
            </FormField>
            <FormField label="高さ" unit="m">
              <input
                type="number"
                value={d.height}
                onChange={e => updateDoor(i, 'height', e.target.value)}
                placeholder="2.0"
                min="0"
                step="0.1"
              />
            </FormField>
            <button
              type="button"
              className={styles.removeButton}
              onClick={() => removeDoor(i)}
            >
              削除
            </button>
          </div>
        ))}

        <button type="button" className={styles.calcButton} onClick={handleCalculate}>
          計算する
        </button>
      </section>

      <AffiliateLinks title="壁紙DIYに必要な道具・材料" items={affiliateItems} />

      {result && (
        <section className={styles.results}>
          <ResultCard title="計算結果">
            <table className={styles.resultTable}>
              <tbody>
                <tr>
                  <td>壁面積（総）</td>
                  <td className={styles.resultValue}>{result.wallArea} m²</td>
                </tr>
                <tr>
                  <td>開口部面積</td>
                  <td className={styles.resultValue}>-{result.openingArea} m²</td>
                </tr>
                <tr className={styles.resultHighlight}>
                  <td>有効面積</td>
                  <td className={styles.resultValue}>{result.effectiveArea} m²</td>
                </tr>
              </tbody>
            </table>
          </ResultCard>

          <ResultCard title="必要な壁紙の量">
            <p className={styles.resultNote}>
              ※ 巾数は部屋の周長から算出しています。開口部が大きい場合、実際より多めになることがあります。
            </p>
            <table className={styles.resultTable}>
              <tbody>
                <tr>
                  <td>巾数</td>
                  <td className={styles.resultValue}>{result.stripCount} 巾</td>
                </tr>
                <tr>
                  <td>1巾あたりの長さ</td>
                  <td className={styles.resultValue}>{result.stripLength} m</td>
                </tr>
                <tr>
                  <td>必要m数</td>
                  <td className={styles.resultValue}>{result.totalLength} m</td>
                </tr>
                <tr className={styles.resultHighlight}>
                  <td>
                    必要ロール数
                    <span className={styles.resultNote}>
                      （{result.rollWidthMm}mm幅 / {result.rollLengthM}mロール）
                    </span>
                  </td>
                  <td className={styles.resultValue}>{result.rollCount} ロール</td>
                </tr>
              </tbody>
            </table>
          </ResultCard>

          <ResultCard title="副資材の目安">
            <table className={styles.resultTable}>
              <tbody>
                <tr>
                  <td>壁紙用のり</td>
                  <td className={styles.resultValue}>{result.supplies.glueKg} kg</td>
                </tr>
                <tr>
                  <td>下地パテ</td>
                  <td className={styles.resultValue}>{result.supplies.puttyKg} kg</td>
                </tr>
                <tr>
                  <td>ジョイントローラー</td>
                  <td className={styles.resultValue}>{result.supplies.rollerCount} 個</td>
                </tr>
              </tbody>
            </table>
          </ResultCard>
        </section>
      )}

      <SeoContent>
        <h2>壁紙の必要量の計算方法</h2>
        <p>
          壁紙の必要量は、部屋の周長（壁の総延長）と天井高から算出します。
          まず周長をロール幅で割って必要な巾数を求め、各巾に天井高＋切りしろ分の長さを確保します。
          柄のある壁紙の場合は、リピート（柄の繰り返し間隔）に合わせて1巾あたりの長さを切り上げるため、
          無地に比べてやや多めの壁紙が必要になります。
        </p>

        <h2>国産壁紙と輸入壁紙の違い</h2>
        <p>
          国産壁紙は幅920mm・1ロール50mが標準です。ビニルクロスが主流で、耐久性が高くコストパフォーマンスに優れます。
          輸入壁紙は幅530mm・1ロール10mが一般的です。紙やフリース素材が多く、デザイン性の高い柄が豊富ですが、
          幅が狭い分だけ必要巾数が増え、ロール数も多くなります。
        </p>

        <h2>柄リピートとは</h2>
        <p>
          柄リピートとは、壁紙の模様が繰り返される間隔のことです。
          隣り合う巾で柄を合わせるため、1巾あたりの長さをリピートの倍数に切り上げる必要があります。
          リピートが大きい柄ほどロス（余り）が増えるため、材料費を抑えたい場合は
          リピートの小さい柄や無地を選ぶのがおすすめです。
        </p>

        <h2>DIYで壁紙を貼るときのコツ</h2>
        <ul>
          <li>下地のホコリや汚れをしっかり拭き取ってからパテ処理をする</li>
          <li>のりは均一に塗り、端まで丁寧に伸ばす</li>
          <li>1巾目は垂直を確認してから貼り始める（下げ振りや水平器を使う）</li>
          <li>継ぎ目はジョイントローラーでしっかり圧着する</li>
          <li>余分な壁紙はカッターで切り落とすが、切れ味の良い新品の刃を使う</li>
        </ul>
      </SeoContent>
    </div>
  )
}
