import { useState } from 'react'
import { FormField } from '../components/FormField'
import { ResultCard } from '../components/ResultCard'
import { PageHead } from '../components/PageHead'
import { AffiliateLinks } from '../components/AffiliateLinks'
import type { AffiliateItem } from '../components/AffiliateLinks'
import { SeoContent } from '../components/SeoContent'
import { CopyResultButton } from '../components/CopyResultButton'
import { useScrollToResult } from '../hooks/useScrollToResult'
import { calculateFlooring } from '../calc/flooring'
import type { LayingMethod, FlooringResult } from '../calc/flooring'
import styles from './CalculatorPage.module.css'

const affiliateItems: readonly AffiliateItem[] = [
  { name: 'フローリング用接着剤', description: '直貼り工法に。ウレタン系が一般的。', amazonKeyword: 'フローリング 接着剤 直貼り', rakutenKeyword: 'フローリング 接着剤 直貼り' },
  { name: 'クッションフロア用接着剤', description: 'CF専用。オープンタイム不要の速乾タイプが便利。', amazonKeyword: 'クッションフロア 接着剤', rakutenKeyword: 'クッションフロア 接着剤' },
  { name: 'フローリング施工道具', description: 'あて木・ハンマー・スペーサーなど。', amazonKeyword: 'フローリング 施工 道具 DIY', rakutenKeyword: 'フローリング 施工 道具 DIY' },
  { name: '床材カッター', description: 'CFのカットに。大型カッターやロータリーカッター。', amazonKeyword: 'クッションフロア カッター', rakutenKeyword: 'クッションフロア カッター' },
]

export function FlooringPage() {
  const [roomWidth, setRoomWidth] = useState('')
  const [roomDepth, setRoomDepth] = useState('')
  const [boardWidth, setBoardWidth] = useState('303')
  const [boardLength, setBoardLength] = useState('1818')
  const [layingMethod, setLayingMethod] = useState<LayingMethod>('parallel')
  const [result, setResult] = useState<FlooringResult | null>(null)
  const [error, setError] = useState('')
  const { resultRef, scrollToResult } = useScrollToResult()

  function handleCalculate() {
    const rw = parseFloat(roomWidth)
    const rd = parseFloat(roomDepth)
    const bw = parseFloat(boardWidth)
    const bl = parseFloat(boardLength)

    if (!rw || !rd || !bw || !bl || rw <= 0 || rd <= 0 || bw <= 0 || bl <= 0) {
      setError('部屋の幅・奥行と床材の規格を入力してください。')
      return
    }

    setError('')
    setResult(calculateFlooring({
      roomWidth: rw,
      roomDepth: rd,
      boardWidth: bw,
      boardLength: bl,
      layingMethod,
    }))
    scrollToResult()
  }

  return (
    <div className={styles.page}>
      <PageHead
        title="床材（フローリング・CF）必要量計算"
        description="部屋の面積と床材の規格から必要枚数を自動計算。並行貼り・斜め貼りのロス率にも対応。フローリング・クッションフロアのDIYに。"
        path="/flooring"
      />
      <h1 className={styles.title}>床材（フローリング・CF）必要量計算</h1>
      <p className={styles.description}>
        部屋の寸法と床材の規格を入力して、必要な枚数を計算します。
        貼り方によるロス率も自動で加算されます。
      </p>

      <section className={styles.form}>
        <h2 className={styles.sectionTitle}>部屋の寸法</h2>
        <div className={styles.grid2}>
          <FormField label="幅" unit="m">
            <input type="number" value={roomWidth} onChange={e => setRoomWidth(e.target.value)} placeholder="3.6" min="0" step="0.1" />
          </FormField>
          <FormField label="奥行" unit="m">
            <input type="number" value={roomDepth} onChange={e => setRoomDepth(e.target.value)} placeholder="2.7" min="0" step="0.1" />
          </FormField>
        </div>

        <h2 className={styles.sectionTitle}>床材の規格</h2>
        <div className={styles.grid2}>
          <FormField label="板の幅" unit="mm">
            <input type="number" value={boardWidth} onChange={e => setBoardWidth(e.target.value)} placeholder="303" min="0" step="1" />
          </FormField>
          <FormField label="板の長さ" unit="mm">
            <input type="number" value={boardLength} onChange={e => setBoardLength(e.target.value)} placeholder="1818" min="0" step="1" />
          </FormField>
        </div>

        <h2 className={styles.sectionTitle}>貼り方</h2>
        <FormField label="貼り方">
          <select value={layingMethod} onChange={e => setLayingMethod(e.target.value as LayingMethod)}>
            <option value="parallel">並行貼り（ロス率 5%）</option>
            <option value="diagonal">斜め貼り（ロス率 10%）</option>
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
            <span className={styles.calloutLabel}>推奨枚数</span>
            <span className={styles.calloutValue}>{result.recommendedCount}</span>
            <span className={styles.calloutUnit}>枚</span>
            <span className={styles.calloutSub}>ロス率{result.lossRate * 100}%込み</span>
          </div>

          <ResultCard title="計算結果">
            <table className={styles.resultTable}>
              <tbody>
                <tr>
                  <td>床面積</td>
                  <td className={styles.resultValue}>{result.floorArea} m²</td>
                </tr>
                <tr>
                  <td>1枚あたり面積</td>
                  <td className={styles.resultValue}>{result.boardArea} m²</td>
                </tr>
                <tr>
                  <td>理論枚数</td>
                  <td className={styles.resultValue}>{result.theoreticalCount} 枚</td>
                </tr>
                <tr>
                  <td>ロス率</td>
                  <td className={styles.resultValue}>{result.lossRate * 100}%</td>
                </tr>
                <tr className={styles.resultHighlight}>
                  <td>推奨枚数（ロス込み）</td>
                  <td className={styles.resultValue}>{result.recommendedCount} 枚</td>
                </tr>
              </tbody>
            </table>
          </ResultCard>

          <ResultCard title="副資材の目安">
            <table className={styles.resultTable}>
              <tbody>
                <tr>
                  <td>{result.supplies.adhesiveType}</td>
                  <td className={styles.resultValue}>{result.supplies.adhesiveKg} kg</td>
                </tr>
              </tbody>
            </table>
          </ResultCard>

          <CopyResultButton getText={() =>
            `【床材 計算結果】\n` +
            `推奨枚数: ${result.recommendedCount}枚（ロス率${result.lossRate * 100}%込み）\n` +
            `床面積: ${result.floorArea}m²\n` +
            `理論枚数: ${result.theoreticalCount}枚\n` +
            `${result.supplies.adhesiveType}: ${result.supplies.adhesiveKg}kg`
          } />

          <p className={styles.disclaimer}>※ 計算結果はあくまで目安です。実際の施工では下地の状態や製品仕様により異なる場合があります。</p>
        </section>
      )}

      <AffiliateLinks title="床材DIYに必要な道具・材料" items={affiliateItems} />

      <SeoContent>
        <h2>床材の必要量の計算方法</h2>
        <p>
          床面積を1枚あたりの面積で割り、切り上げて理論枚数を算出します。
          実際の施工では壁際のカットや柄合わせでロスが発生するため、
          並行貼りで約5%、斜め貼りで約10%のロス率を加算するのが一般的です。
        </p>

        <h2>フローリングの一般的なサイズ</h2>
        <p>
          国産フローリングの標準サイズは幅303mm×長さ1818mm（6尺）です。
          無垢材では幅90mm〜120mm程度の細いものもあります。
          クッションフロア（CF）はロール状で幅1820mmが標準で、必要な長さで切り売りされます。
        </p>

        <h2>並行貼りと斜め貼りの違い</h2>
        <p>
          並行貼りは壁と平行に板を並べる最も一般的な方法で、ロスが少なく施工も簡単です。
          斜め貼りは壁に対して45度の角度で板を配置し、デザイン性が高くなりますが、
          壁際のカットが多くなるためロスが増えます。
        </p>

        <h2>DIYでフローリングを貼るときのコツ</h2>
        <ul>
          <li>壁との間に5〜10mmの隙間（膨張目地）を確保する</li>
          <li>下地が平坦であることを確認し、凹凸があれば補修する</li>
          <li>板のつなぎ目が一直線にならないよう、千鳥配置（ずらし貼り）にする</li>
          <li>最後の1列は幅が狭くなりすぎないよう、1列目の幅で調整する</li>
        </ul>
      </SeoContent>
    </div>
  )
}
