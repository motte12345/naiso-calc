import { Link, Outlet } from 'react-router-dom'
import styles from './Layout.module.css'

export function Layout() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          内装材料カリキュレーター
        </Link>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <p>&copy; 2026 内装材料カリキュレーター</p>
      </footer>
    </div>
  )
}
