import type { ReactNode } from 'react'
import styles from './SeoContent.module.css'

type Props = {
  readonly children: ReactNode
}

export function SeoContent({ children }: Props) {
  return (
    <section className={styles.section}>
      {children}
    </section>
  )
}
