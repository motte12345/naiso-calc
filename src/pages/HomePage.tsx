import { Link } from 'react-router-dom'
import { PageHead } from '../components/PageHead'
import styles from './HomePage.module.css'

type Tool = {
  readonly path: string
  readonly name: string
  readonly description: string
  readonly ready: boolean
}

const tools: readonly Tool[] = [
  {
    path: '/wallpaper',
    name: '壁紙（クロス）必要量計算',
    description: '部屋の寸法から壁紙の必要m数・ロール数を計算。窓やドアの除外、柄リピートにも対応。',
    ready: true,
  },
  {
    path: '/flooring',
    name: '床材（フローリング・CF）必要量計算',
    description: '部屋の面積と床材の規格から必要枚数を算出。並行貼り・斜め貼りのロス率も加算。',
    ready: true,
  },
  {
    path: '/tile',
    name: 'タイル必要枚数計算',
    description: '施工面のサイズとタイル寸法・目地幅から必要枚数と目地材の量を計算。',
    ready: true,
  },
  {
    path: '/paint',
    name: 'ペンキ・塗料の必要量計算',
    description: '塗装面積と塗り回数から必要リットル数と缶のサイズ別必要個数を計算。',
    ready: true,
  },
]

export function HomePage() {
  return (
    <div className={styles.page}>
      <PageHead
        title="内装材料カリキュレーター"
        description="DIYやリフォームで必要な壁紙・床材・タイル・ペンキの量を簡単に計算。窓やドアの除外、柄リピート、目地幅にも対応した無料ツール。"
        path="/"
      />
      <h1 className={styles.title}>内装材料カリキュレーター</h1>
      <p className={styles.description}>
        DIYやリフォームで必要な内装材料の量を簡単に計算できます。
        窓やドアの除外、柄リピート、目地幅など実用的なパラメータに対応しています。
      </p>
      <div className={styles.grid}>
        {tools.map(tool => (
          <div key={tool.path} className={styles.card}>
            <h2 className={styles.cardTitle}>{tool.name}</h2>
            <p className={styles.cardDescription}>{tool.description}</p>
            {tool.ready ? (
              <Link to={tool.path} className={styles.cardLink}>
                計算する →
              </Link>
            ) : (
              <span className={styles.cardComingSoon}>準備中</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
