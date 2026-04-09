import { Link, NavLink, Outlet } from 'react-router-dom'
import styles from './Layout.module.css'

const navItems = [
  { path: '/wallpaper', label: '壁紙' },
  { path: '/flooring', label: '床材' },
  { path: '/tile', label: 'タイル' },
  { path: '/paint', label: 'ペンキ' },
] as const

export function Layout() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.logo}>
            内装材料カリキュレーター
          </Link>
          <nav className={styles.nav}>
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <p className={styles.footerRelated}>
          関連ツール:{' '}
          <a href="https://hikkoshi.simtool.dev/" target="_blank" rel="noopener noreferrer">
            引越し費用シミュレーター
          </a>
        </p>
        <p>&copy; 2026 内装材料カリキュレーター</p>
        <Link to="/about" className={styles.footerLink}>サイトについて・免責事項</Link>
      </footer>
    </div>
  )
}
