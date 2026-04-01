import { PageHead } from '../components/PageHead'
import { Breadcrumb } from '../components/Breadcrumb'
import { StructuredData } from '../components/StructuredData'
import styles from './AboutPage.module.css'

export function AboutPage() {
  return (
    <div className={styles.page}>
      <PageHead
        title="サイトについて"
        description="内装材料カリキュレーターについて。DIYやリフォームで必要な壁紙・床材・タイル・ペンキの量を計算する無料ツール。"
        path="/about"
      />
      <StructuredData
        title="サイトについて | 内装材料カリキュレーター"
        description="内装材料カリキュレーターについて。DIYやリフォームで必要な壁紙・床材・タイル・ペンキの量を計算する無料ツール。"
        path="/about"
      />
      <Breadcrumb items={[{ label: 'サイトについて', path: '/about' }]} />
      <h1 className={styles.title}>サイトについて</h1>

      <section className={styles.section}>
        <h2>内装材料カリキュレーターとは</h2>
        <p>
          DIYやリフォームで必要な内装材料の量を簡単に計算できる無料ツール集です。
          壁紙・床材・タイル・ペンキの4種類の計算に対応しています。
        </p>
      </section>

      <section className={styles.section}>
        <h2>特長</h2>
        <ul>
          <li>窓やドアを除外して正確な面積を算出</li>
          <li>柄リピートや目地幅など実用的なパラメータに対応</li>
          <li>副資材（接着剤・下地材など）の目安量も表示</li>
          <li>スマホでも使いやすいレスポンシブ設計</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>免責事項</h2>
        <p>
          本サイトの計算結果はあくまで目安です。実際の施工では、部屋の形状・下地の状態・
          製品の仕様などにより必要量が異なる場合があります。
          材料の購入・施工は自己責任でお願いいたします。
          計算結果に基づく損害について、当サイトは一切の責任を負いかねます。
        </p>
      </section>
    </div>
  )
}
