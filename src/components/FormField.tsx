import type { ReactNode } from 'react'
import styles from './FormField.module.css'

type Props = {
  readonly label: string
  readonly unit?: string
  readonly children: ReactNode
}

export function FormField({ label, unit, children }: Props) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>
        {label}
        {unit && <span className={styles.unit}>（{unit}）</span>}
      </label>
      <div className={styles.input}>{children}</div>
    </div>
  )
}
