import { Link } from 'react-router-dom'
import styles from './Breadcrumb.module.css'

const BASE_URL = 'https://naiso.simtool.dev'

type BreadcrumbItem = {
  readonly label: string
  readonly path: string
}

type Props = {
  readonly items: readonly BreadcrumbItem[]
}

export function Breadcrumb({ items }: Props) {
  const allItems: readonly BreadcrumbItem[] = [
    { label: 'ホーム', path: '/' },
    ...items,
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${BASE_URL}${item.path}`,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="パンくずリスト" className={styles.breadcrumb}>
        <ol className={styles.list}>
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1
            return (
              <li key={item.path} className={styles.item}>
                {isLast ? (
                  <span className={styles.current} aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <>
                    <Link to={item.path} className={styles.link}>
                      {item.label}
                    </Link>
                    <span className={styles.separator} aria-hidden="true">&gt;</span>
                  </>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
