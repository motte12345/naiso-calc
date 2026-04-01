import type { ReactNode } from 'react'
import styles from './ResultCard.module.css'

type Props = {
  readonly title: string
  readonly children: ReactNode
}

export function ResultCard({ title, children }: Props) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.body}>{children}</div>
    </div>
  )
}
