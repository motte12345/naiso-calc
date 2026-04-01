import { useState } from 'react'
import { FormField } from '../components/FormField'
import { ResultCard } from '../components/ResultCard'
import { PageHead } from '../components/PageHead'
import { AffiliateLinks } from '../components/AffiliateLinks'
import type { AffiliateItem } from '../components/AffiliateLinks'
import { SeoContent } from '../components/SeoContent'
import { CopyResultButton } from '../components/CopyResultButton'
import { Breadcrumb } from '../components/Breadcrumb'
import { StructuredData } from '../components/StructuredData'
import { useScrollToResult } from '../hooks/useScrollToResult'
import { calculatePaint } from '../calc/paint'
import type { PaintInputMode, PaintResult, Opening } from '../calc/paint'
import styles from './CalculatorPage.module.css'

const affiliateItems: readonly AffiliateItem[] = [
  { name: '水性塗料（室内用）', description: '臭いが少なく乾きが早い。DIYの定番。', amazonKeyword: '水性塗料 室内 DIY', rakutenKeyword: '水性塗料 室内 DIY' },
  { name: 'ローラーセット', description: 'ローラー・トレイ・ハケのセット。', amazonKeyword: 'ペンキ ローラー セット DIY', rakutenKeyword: 'ペンキ ローラー セット DIY' },
  { name: 'マスキングテープ', description: '塗りたくない部分を保護。幅18〜24mmが使いやすい。', amazonKeyword: 'マスキングテープ 塗装用', rakutenKeyword: 'マスキングテープ 塗装用' },
  { name: '養生シート', description: '床や家具をペンキの飛散から守る。', amazonKeyword: '養生シート 塗装 DIY', rakutenKeyword: '養生シート 塗装 DIY' },
]

type OpeningInput = {
  readonly width: string
  readonly height: string
}

const EMPTY_OPENING: OpeningInput = { width: '', height: '' }

export function PaintPage() {
  const [mode, setMode] = useState<PaintInputMode>('room')
  const [directArea, setDirectArea] = useState('')
  const [roomWidth, setRoomWidth] = useState('')
  const [roomDepth, setRoomDepth] = useState('')
  const [roomHeight, setRoomHeight] = useState('2.4')
  const [coatCount, setCoatCount] = useState('2')
  const [windows, setWindows] = useState<readonly OpeningInput[]>([])
  const [doors, setDoors] = useState<readonly OpeningInput[]>([])
  const [result, setResult] = useState<PaintResult | null>(null)
  const [error, setError] = useState('')
  const { resultRef, scrollToResult } = useScrollToResult()

  function addWindow() { setWindows([...windows, EMPTY_OPENING]) }
  function removeWindow(i: number) { setWindows(windows.filter((_, idx) => idx !== i)) }
  function updateWindow(i: number, field: keyof OpeningInput, value: string) {
    setWindows(windows.map((w, idx) => idx === i ? { ...w, [field]: value } : w))
  }

  function addDoor() { setDoors([...doors, EMPTY_OPENING]) }
  function removeDoor(i: number) { setDoors(doors.filter((_, idx) => idx !== i)) }
  function updateDoor(i: number, field: keyof OpeningInput, value: string) {
    setDoors(doors.map((d, idx) => idx === i ? { ...d, [field]: value } : d))
  }

  function parseOpenings(inputs: readonly OpeningInput[]): readonly Opening[] {
    return inputs
      .map(o => ({ width: parseFloat(o.width) || 0, height: parseFloat(o.height) || 0 }))
      .filter(o => o.width > 0 && o.height > 0)
  }

  function handleCalculate() {
    const cc = parseInt(coatCount, 10)
    if (!cc || cc < 1) {
      setError('塗り回数を選択してください。')
      return
    }

    if (mode === 'direct') {
      const area = parseFloat(directArea)
      if (!area || area <= 0) {
        setError('塗装面積を入力してください。')
        return
      }
      setError('')
      setResult(calculatePaint({ mode: 'direct', directArea: area, coatCount: cc }))
    } else {
      const rw = parseFloat(roomWidth)
      const rd = parseFloat(roomDepth)
      const rh = parseFloat(roomHeight)
      if (!rw || !rd || !rh || rw <= 0 || rd <= 0 || rh <= 0) {
        setError('部屋の幅・奥行・高さを入力してください。')
        return
      }
      setError('')
      setResult(calculatePaint({
        mode: 'room',
        roomWidth: rw,
        roomDepth: rd,
        roomHeight: rh,
        windows: parseOpenings(windows),
        doors: parseOpenings(doors),
        coatCount: cc,
      }))
    }
    scrollToResult()
  }

  return (
    <div className={styles.page}>
      <PageHead
        title="ペンキ・塗料の必要量計算"
        description="塗装面積と塗り回数から必要なペンキの量を自動計算。0.7L・1.6L・4L缶のサイズ別必要個数も表示。部屋の寸法からの面積算出にも対応。"
        path="/paint"
      />
      <StructuredData
        title="ペンキ・塗料の必要量計算 | 内装材料カリキュレーター"
        description="塗装面積と塗り回数から必要なペンキの量を自動計算。0.7L・1.6L・4L缶のサイズ別必要個数も表示。部屋の寸法からの面積算出にも対応。"
        path="/paint"
      />
      <Breadcrumb items={[{ label: 'ペンキ・塗料の必要量計算', path: '/paint' }]} />
      <h1 className={styles.title}>ペンキ・塗料の必要量計算</h1>
      <p className={styles.description}>
        塗装面積と塗り回数から、必要なペンキの量と缶のサイズ別必要個数を計算します。
        部屋の寸法から面積を算出することもできます。
      </p>

      <section className={styles.form}>
        <h2 className={styles.sectionTitle}>入力方法</h2>
        <FormField label="入力方法">
          <select value={mode} onChange={e => setMode(e.target.value as PaintInputMode)}>
            <option value="room">部屋の寸法から計算</option>
            <option value="direct">塗装面積を直接入力</option>
          </select>
        </FormField>

        {mode === 'direct' ? (
          <>
            <h2 className={styles.sectionTitle}>塗装面積</h2>
            <FormField label="面積" unit="m²">
              <input type="number" value={directArea} onChange={e => setDirectArea(e.target.value)} placeholder="30" min="0" step="0.1" />
            </FormField>
          </>
        ) : (
          <>
            <h2 className={styles.sectionTitle}>部屋の寸法</h2>
            <div className={styles.grid3}>
              <FormField label="幅" unit="m">
                <input type="number" value={roomWidth} onChange={e => setRoomWidth(e.target.value)} placeholder="3.6" min="0" step="0.1" />
              </FormField>
              <FormField label="奥行" unit="m">
                <input type="number" value={roomDepth} onChange={e => setRoomDepth(e.target.value)} placeholder="2.7" min="0" step="0.1" />
              </FormField>
              <FormField label="高さ" unit="m">
                <input type="number" value={roomHeight} onChange={e => setRoomHeight(e.target.value)} placeholder="2.4" min="0" step="0.1" />
              </FormField>
            </div>

            <h2 className={styles.sectionTitle}>
              窓<span className={styles.sectionHint}>（ない場合はスキップ）</span>
              <button type="button" className={styles.addButton} onClick={addWindow}>+ 追加</button>
            </h2>
            {windows.map((w, i) => (
              <div key={i} className={styles.openingRow}>
                <span className={styles.openingLabel}>窓{i + 1}</span>
                <FormField label="幅" unit="m">
                  <input type="number" value={w.width} onChange={e => updateWindow(i, 'width', e.target.value)} placeholder="1.8" min="0" step="0.1" />
                </FormField>
                <FormField label="高さ" unit="m">
                  <input type="number" value={w.height} onChange={e => updateWindow(i, 'height', e.target.value)} placeholder="1.2" min="0" step="0.1" />
                </FormField>
                <button type="button" className={styles.removeButton} onClick={() => removeWindow(i)}>削除</button>
              </div>
            ))}

            <h2 className={styles.sectionTitle}>
              ドア<span className={styles.sectionHint}>（ない場合はスキップ）</span>
              <button type="button" className={styles.addButton} onClick={addDoor}>+ 追加</button>
            </h2>
            {doors.map((d, i) => (
              <div key={i} className={styles.openingRow}>
                <span className={styles.openingLabel}>ドア{i + 1}</span>
                <FormField label="幅" unit="m">
                  <input type="number" value={d.width} onChange={e => updateDoor(i, 'width', e.target.value)} placeholder="0.8" min="0" step="0.1" />
                </FormField>
                <FormField label="高さ" unit="m">
                  <input type="number" value={d.height} onChange={e => updateDoor(i, 'height', e.target.value)} placeholder="2.0" min="0" step="0.1" />
                </FormField>
                <button type="button" className={styles.removeButton} onClick={() => removeDoor(i)}>削除</button>
              </div>
            ))}
          </>
        )}

        <h2 className={styles.sectionTitle}>塗り回数</h2>
        <FormField label="回数">
          <select value={coatCount} onChange={e => setCoatCount(e.target.value)}>
            <option value="1">1回塗り</option>
            <option value="2">2回塗り（推奨）</option>
            <option value="3">3回塗り</option>
          </select>
        </FormField>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <button type="button" className={styles.calcButton} onClick={handleCalculate}>
          計算する
        </button>
      </section>

      {result && (
        <section className={styles.results} ref={resultRef}>
          <div className={styles.callout}>
            <span className={styles.calloutLabel}>必要量</span>
            <span className={styles.calloutValue}>{result.totalLiters}</span>
            <span className={styles.calloutUnit}>L</span>
            <span className={styles.calloutSub}>{coatCount}回塗り</span>
          </div>

          <ResultCard title="計算結果">
            <table className={styles.resultTable}>
              <tbody>
                <tr>
                  <td>塗装面積</td>
                  <td className={styles.resultValue}>{result.paintArea} m²</td>
                </tr>
                <tr>
                  <td>1回あたり</td>
                  <td className={styles.resultValue}>{result.litersPerCoat} L</td>
                </tr>
                <tr className={styles.resultHighlight}>
                  <td>必要量（{coatCount}回塗り）</td>
                  <td className={styles.resultValue}>{result.totalLiters} L</td>
                </tr>
              </tbody>
            </table>
          </ResultCard>

          <ResultCard title="缶サイズ別の必要個数">
            <table className={styles.resultTable}>
              <tbody>
                {result.cans.map(can => (
                  <tr key={can.label}>
                    <td>{can.label}</td>
                    <td className={styles.resultValue}>{can.count} 個</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ResultCard>

          <ResultCard title="副資材の目安">
            <table className={styles.resultTable}>
              <tbody>
                <tr>
                  <td>マスキングテープ</td>
                  <td className={styles.resultValue}>{result.supplies.maskingTapeM} m</td>
                </tr>
                <tr>
                  <td>ローラーセット</td>
                  <td className={styles.resultValue}>{result.supplies.rollerSets} セット</td>
                </tr>
                <tr>
                  <td>養生シート</td>
                  <td className={styles.resultValue}>{result.supplies.dropSheetM2} m²</td>
                </tr>
              </tbody>
            </table>
          </ResultCard>

          <CopyResultButton getText={() =>
            `【ペンキ 計算結果】\n` +
            `必要量: ${result.totalLiters}L（${coatCount}回塗り）\n` +
            `塗装面積: ${result.paintArea}m²\n` +
            `缶サイズ別: ${result.cans.map(c => `${c.label}×${c.count}`).join(' / ')}`
          } />

          <p className={styles.disclaimer}>※ 計算結果はあくまで目安です。実際の施工では下地の状態や製品仕様により異なる場合があります。</p>
        </section>
      )}

      <AffiliateLinks title="塗装DIYに必要な道具・材料" items={affiliateItems} />

      <SeoContent>
        <h2>ペンキの必要量の計算方法</h2>
        <p>
          一般的な水性塗料の塗布面積は約8m²/Lです。
          塗装面積をこの数値で割ると1回分の必要量が求まります。
          通常は2回塗りが推奨されており、下塗り（1回目）で色ムラを抑え、
          上塗り（2回目）で均一な仕上がりにします。
        </p>

        <h2>缶サイズの選び方</h2>
        <p>
          ペンキは0.7L・1.6L・4Lの缶サイズが一般的です。
          必要量ぴったりの缶が無い場合は、少し大きめのサイズを選びましょう。
          開封後のペンキは徐々に劣化するため、大幅に余る量を買うのは避けた方が経済的です。
        </p>

        <h2>水性塗料と油性塗料の違い</h2>
        <p>
          水性塗料は臭いが少なく、道具の洗浄も水でできるためDIY向きです。
          乾燥時間が短く、室内の壁や天井の塗装に広く使われています。
          油性塗料は耐候性・耐水性に優れますが、臭いが強く換気が必要です。
          本ツールは水性塗料（8m²/L）を基準に計算しています。
        </p>

        <h2>DIYでペンキを塗るときのコツ</h2>
        <ul>
          <li>塗る前にマスキングテープで塗りたくない部分を丁寧に養生する</li>
          <li>ローラーにペンキを含ませたら、トレイの上で余分な塗料を落とす</li>
          <li>端や角はハケで先に塗り、広い面はローラーで一方向に塗る</li>
          <li>1回目が完全に乾いてから2回目を塗る（通常2〜4時間）</li>
          <li>塗料をよくかき混ぜてから使う（底に顔料が沈殿している）</li>
        </ul>
      </SeoContent>
    </div>
  )
}
