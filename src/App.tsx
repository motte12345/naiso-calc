import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { WallpaperPage } from './pages/WallpaperPage'
import { FlooringPage } from './pages/FlooringPage'
import { TilePage } from './pages/TilePage'
import { PaintPage } from './pages/PaintPage'
import { AboutPage } from './pages/AboutPage'

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/wallpaper" element={<WallpaperPage />} />
        <Route path="/flooring" element={<FlooringPage />} />
        <Route path="/tile" element={<TilePage />} />
        <Route path="/paint" element={<PaintPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>
    </Routes>
  )
}
