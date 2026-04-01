import styles from './AffiliateLinks.module.css'

export type AffiliateItem = {
  readonly name: string
  readonly description: string
  readonly amazonKeyword: string
  readonly rakutenKeyword: string
}

type Props = {
  readonly title: string
  readonly items: readonly AffiliateItem[]
}

function amazonSearchUrl(keyword: string): string {
  return `https://www.amazon.co.jp/s?k=${encodeURIComponent(keyword)}&tag=qp2026-22`
}

function rakutenSearchUrl(keyword: string): string {
  return `https://hb.afl.rakuten.co.jp/hgc/526c1e79.46d4a30e.526c1e7a.3db24b05/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F${encodeURIComponent(keyword)}%2F`
}

export function AffiliateLinks({ title, items }: Props) {
  return (
    <section className={styles.section}>
      <h3 className={styles.title}>{title}<span className={styles.prBadge}>PR</span></h3>
      <p className={styles.disclosure}>※ このセクションにはアフィリエイトリンクを含みます</p>
      <div className={styles.grid}>
        {items.map(item => (
          <div key={item.name} className={styles.card}>
            <div className={styles.cardBody}>
              <p className={styles.itemName}>{item.name}</p>
              <p className={styles.itemDesc}>{item.description}</p>
            </div>
            <div className={styles.links}>
              <a
                href={amazonSearchUrl(item.amazonKeyword)}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className={styles.amazonLink}
              >
                Amazonで探す
              </a>
              <a
                href={rakutenSearchUrl(item.rakutenKeyword)}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className={styles.rakutenLink}
              >
                楽天で探す
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
