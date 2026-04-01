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
import { calculateTile } from '../calc/tile'
import type { TileResult } from '../calc/tile'
import styles from './CalculatorPage.module.css'

const affiliateItems: readonly AffiliateItem[] = [
  { name: 'タイル用接着剤', description: '内装タイルの圧着に。セメント系・樹脂系。', amazonKeyword: 'タイル 接着剤 内装', rakutenKeyword: 'タイル 接着剤 内装' },
  { name: '目地材', description: '白・グレーなど色が選べる。防カビタイプが人気。', amazonKeyword: 'タイル 目地材 DIY', rakutenKeyword: 'タイル 目地材 DIY' },
  { name: 'タイルカッター', description: '手動式で直線カット。曲線にはニッパーを併用。', amazonKeyword: 'タイルカッター 手動', rakutenKeyword: 'タイルカッター 手動' },
  { name: '目地ゴテ・スポンジ', description: '目地を詰めて仕上げるための道具。', amazonKeyword: 'タイル 目地ゴテ スポンジ', rakutenKeyword: 'タイル 目地ゴテ スポンジ' },
]

export function TilePage() {
  const [surfaceWidth, setSurfaceWidth] = useState('')
  const [surfaceHeight, setSurfaceHeight] = useState('')
  const [tileWidth, setTileWidth] = useState('100')
  const [tileHeight, setTileHeight] = useState('100')
  const [jointWidth, setJointWidth] = useState('3')
  const [tileThickness, setTileThickness] = useState('7')
  const [result, setResult] = useState<TileResult | null>(null)
  const [error, setError] = useState('')
  const { resultRef, scrollToResult } = useScrollToResult()

  function handleCalculate() {
    const sw = parseFloat(surfaceWidth)
    const sh = parseFloat(surfaceHeight)
    const tw = parseFloat(tileWidth)
    const th = parseFloat(tileHeight)
    const jw = parseFloat(jointWidth)
    const tt = parseFloat(tileThickness)

    if (!sw || !sh || !tw || !th || sw <= 0 || sh <= 0 || tw <= 0 || th <= 0) {
      setError('施工面のサイズとタイルの寸法を入力してください。')
      return
    }

    setError('')
    setResult(calculateTile({
      surfaceWidth: sw,
      surfaceHeight: sh,
      tileWidth: tw,
      tileHeight: th,
      jointWidth: jw >= 0 ? jw : 0,
      tileThickness: tt > 0 ? tt : 7,
    }))
    scrollToResult()
  }

  return (
    <div className={styles.page}>
      <PageHead
        title="タイル必要枚数計算"
        description="施工面のサイズとタイル寸法・目地幅から必要枚数と目地材の量を自動計算。予備分（+10%）も加算。キッチン・洗面のDIYタイル貼りに。"
        path="/tile"
      />
      <StructuredData
        title="タイル必要枚数計算 | 内装材料カリキュレーター"
        description="施工面のサイズとタイル寸法・目地幅から必要枚数と目地材の量を自動計算。予備分（+10%）も加算。キッチン・洗面のDIYタイル貼りに。"
        path="/tile"
      />
      <Breadcrumb items={[{ label: 'タイル必要枚数計算', path: '/tile' }]} />
      <h1 className={styles.title}>タイル必要枚数計算</h1>
      <p className={styles.description}>
        施工面のサイズとタイルの寸法・目地幅を入力して、必要な枚数と目地材の量を計算します。
        予備分（+10%）も自動で加算されます。
      </p>

      <section className={styles.form}>
        <h2 className={styles.sectionTitle}>施工面のサイズ</h2>
        <div className={styles.grid2}>
          <FormField label="幅" unit="mm">
            <input type="number" value={surfaceWidth} onChange={e => setSurfaceWidth(e.target.value)} placeholder="1800" min="0" step="1" />
          </FormField>
          <FormField label="高さ" unit="mm">
            <input type="number" value={surfaceHeight} onChange={e => setSurfaceHeight(e.target.value)} placeholder="900" min="0" step="1" />
          </FormField>
        </div>

        <h2 className={styles.sectionTitle}>タイルの寸法</h2>
        <div className={styles.grid2}>
          <FormField label="タイル幅" unit="mm">
            <input type="number" value={tileWidth} onChange={e => setTileWidth(e.target.value)} placeholder="100" min="0" step="1" />
          </FormField>
          <FormField label="タイル高さ" unit="mm">
            <input type="number" value={tileHeight} onChange={e => setTileHeight(e.target.value)} placeholder="100" min="0" step="1" />
          </FormField>
        </div>
        <div className={styles.grid2}>
          <FormField label="目地幅" unit="mm">
            <input type="number" value={jointWidth} onChange={e => setJointWidth(e.target.value)} placeholder="3" min="0" step="0.5" />
          </FormField>
          <FormField label="タイル厚み" unit="mm">
            <input type="number" value={tileThickness} onChange={e => setTileThickness(e.target.value)} placeholder="7" min="0" step="1" />
          </FormField>
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <button type="button" className={styles.calcButton} onClick={handleCalculate}>
          計算する
        </button>
      </section>

      {result && (
        <section className={styles.results} ref={resultRef}>
          <div className={styles.callout}>
            <span className={styles.calloutLabel}>予備込み枚数</span>
            <span className={styles.calloutValue}>{result.withSpareCount}</span>
            <span className={styles.calloutUnit}>枚</span>
            <span className={styles.calloutSub}>+10%予備含む</span>
          </div>

          <ResultCard title="計算結果">
            <table className={styles.resultTable}>
              <tbody>
                <tr>
                  <td>施工面積</td>
                  <td className={styles.resultValue}>{result.surfaceAreaM2} m²</td>
                </tr>
                <tr>
                  <td>横枚数 × 縦枚数</td>
                  <td className={styles.resultValue}>{result.horizontalCount} × {result.verticalCount}</td>
                </tr>
                <tr>
                  <td>必要枚数</td>
                  <td className={styles.resultValue}>{result.requiredCount} 枚</td>
                </tr>
                <tr className={styles.resultHighlight}>
                  <td>予備込み（+10%）</td>
                  <td className={styles.resultValue}>{result.withSpareCount} 枚</td>
                </tr>
              </tbody>
            </table>
          </ResultCard>

          <ResultCard title="目地材">
            <table className={styles.resultTable}>
              <tbody>
                <tr>
                  <td>目地材</td>
                  <td className={styles.resultValue}>{result.jointMaterialKg} kg</td>
                </tr>
              </tbody>
            </table>
          </ResultCard>

          <CopyResultButton getText={() =>
            `【タイル 計算結果】\n` +
            `予備込み枚数: ${result.withSpareCount}枚（+10%）\n` +
            `必要枚数: ${result.requiredCount}枚（${result.horizontalCount}×${result.verticalCount}）\n` +
            `目地材: ${result.jointMaterialKg}kg`
          } />

          <p className={styles.disclaimer}>※ 計算結果はあくまで目安です。実際の施工では下地の状態や製品仕様により異なる場合があります。</p>
        </section>
      )}

      <AffiliateLinks title="タイルDIYに必要な道具・材料" items={affiliateItems} />

      <SeoContent>
        <h2>タイル必要枚数の計算方法</h2>
        <p>
          施工面の幅と高さを、タイル1枚のサイズ＋目地幅で割って横・縦の枚数を求めます。
          端数は切り上げるため、実際の施工面よりやや多めになります。
          さらに施工中の割れや切り損じに備えて、10%の予備分を加算しています。
        </p>

        <h2>目地幅の選び方</h2>
        <p>
          一般的なタイルの目地幅は2〜5mm程度です。小さいタイルやモザイクタイルは2〜3mm、
          大判タイル（300mm以上）は3〜5mmが目安です。
          目地幅を広くするとカジュアルな印象に、狭くするとシャープな仕上がりになります。
        </p>

        <h2>目地材の種類</h2>
        <p>
          セメント系目地材が最も一般的で、水を加えて練って使います。
          水回りには防カビ剤入りのものを選びましょう。
          色はホワイト・グレー・ブラウンなどがあり、タイルの色に合わせて選べます。
        </p>

        <h2>DIYでタイルを貼るときのコツ</h2>
        <ul>
          <li>施工面の中心から貼り始め、端のカットが左右均等になるようにする</li>
          <li>接着剤はクシ目ゴテで均一に塗り広げる</li>
          <li>タイルを置いたら軽く叩いて密着させる</li>
          <li>目地を詰めた後、濡れたスポンジで余分な目地材を拭き取る</li>
          <li>完全に乾くまで水をかけない（24時間以上）</li>
        </ul>
      </SeoContent>
    </div>
  )
}
