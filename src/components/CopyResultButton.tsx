import { useState, useCallback } from 'react'
import styles from './CopyResultButton.module.css'

type Props = {
  readonly getText: () => string
}

export function CopyResultButton({ getText }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getText())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard API が使えない環境は無視
    }
  }, [getText])

  return (
    <button type="button" className={styles.button} onClick={handleCopy}>
      {copied ? 'コピーしました!' : '結果をコピー'}
    </button>
  )
}
