/**
 * SSG prerender script.
 *
 * Runs after `vite build`. For each route, renders the React tree to an HTML
 * string using StaticRouter (react-router) + HelmetProvider (react-helmet-async),
 * then injects the result into dist/index.html.
 *
 * React 19 + react-helmet-async v3 behaviour:
 *   renderToString() returns <title> and <meta> tags inline at the start of the
 *   rendered string (React19Dispatcher.render()). These are extracted and moved
 *   into <head>, replacing the template placeholders.
 *
 * Usage (called by npm run build):
 *   TSX_TSCONFIG_PATH=tsconfig.app.json node --import tsx/esm --import ./scripts/register-hooks.js scripts/prerender.ts
 */

import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { renderToString } from 'react-dom/server'
import { createElement } from 'react'
import { StaticRouter } from 'react-router'
import { HelmetProvider } from 'react-helmet-async'
import { App } from '../src/App'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const distDir = join(__dirname, '..', 'dist')

const routes = ['/', '/wallpaper', '/flooring', '/tile', '/paint', '/about']

/**
 * Head tags emitted by React 19 + react-helmet-async are placed at the very
 * beginning of the renderToString output before the actual DOM tree.
 * This pattern captures them greedily until we hit the first non-head element.
 */
const HEAD_TAG_PATTERN = /^((?:<(?:title|meta|link|base|script|style|noscript)[^>]*(?:\/>|>(?:[^<]*)<\/(?:title|meta|link|base|script|style|noscript)>)\s*)*)/

function extractHeadTags(rendered: string): { headHtml: string; bodyHtml: string } {
  const match = rendered.match(HEAD_TAG_PATTERN)
  if (!match || !match[1]) {
    return { headHtml: '', bodyHtml: rendered }
  }
  return {
    headHtml: match[1].trim(),
    bodyHtml: rendered.slice(match[1].length),
  }
}

function prerenderRoute(template: string, route: string): string {
  const rendered = renderToString(
    createElement(
      HelmetProvider,
      { context: {} },
      createElement(
        StaticRouter,
        { location: route },
        createElement(App),
      ),
    ),
  )

  const { headHtml, bodyHtml } = extractHeadTags(rendered)

  // Inject body HTML into root div
  let result = template.replace(
    '<div id="root"></div>',
    `<div id="root">${bodyHtml}</div>`,
  )

  if (headHtml) {
    // Extract <title> from the rendered head tags
    const titleMatch = headHtml.match(/<title[^>]*>(?:[^<]*)<\/title>/)
    if (titleMatch) {
      // Replace the static <title> in the template with the page-specific one
      result = result.replace(/<title>[^<]*<\/title>/, titleMatch[0])
    }

    // Remove the <title> tag from headHtml (already handled above) and strip
    // the static <meta name="description"> from the template to avoid duplication
    const metaAndLinks = headHtml
      .replace(/<title[^>]*>(?:[^<]*)<\/title>\s*/, '')
      .trim()

    if (metaAndLinks) {
      result = result.replace(
        /<meta name="description"[^>]*>/,
        '',
      )
      result = result.replace('</head>', `${metaAndLinks}\n</head>`)
    }
  }

  return result
}

function writeRoute(route: string, content: string): void {
  if (route === '/') {
    writeFileSync(join(distDir, 'index.html'), content, 'utf-8')
    console.log(`  Rendered / → dist/index.html`)
    return
  }

  const routeDir = join(distDir, route.slice(1))
  mkdirSync(routeDir, { recursive: true })
  writeFileSync(join(routeDir, 'index.html'), content, 'utf-8')
  console.log(`  Rendered ${route} → dist${route}/index.html`)
}

function normalizeTemplate(raw: string): string {
  // If the file was already prerendered (e.g. the script runs a second time),
  // the root div may contain content. Strip it so we always work from a clean
  // <div id="root"></div> placeholder, and remove any previously injected head
  // tags (meta / link / canonical lines) to avoid duplication.

  // 1. Clear contents of <div id="root">...</div>
  let normalized = raw.replace(
    /<div id="root">[\s\S]*?<\/div>(?=\s*<\/body>)/,
    '<div id="root"></div>',
  )

  // 2. Remove lines that were injected by a previous prerender run.
  //    These are meta/link tags that appear between </title> and </head>.
  //    We keep charset, viewport, icon, and the Vite-generated asset tags.
  normalized = normalized.replace(
    /(<\/title>\s*\n?)([\s\S]*?)(<\/head>)/,
    (_match, afterTitle, injected, endHead) => {
      // Strip any meta/link lines that were previously injected
      const cleaned = injected
        .split('\n')
        .filter((line: string) => {
          const trimmed = line.trim()
          if (!trimmed) return true // keep blank lines for formatting
          // Keep Vite asset lines (script, stylesheet link)
          if (trimmed.startsWith('<script') || trimmed.startsWith('<link rel="stylesheet')) return true
          // Remove previously injected meta/link from helmet
          if (trimmed.startsWith('<meta') || trimmed.startsWith('<link')) return false
          return true
        })
        .join('\n')
      return `${afterTitle}${cleaned}${endHead}`
    },
  )

  return normalized
}

function main(): void {
  const raw = readFileSync(join(distDir, 'index.html'), 'utf-8')
  const template = normalizeTemplate(raw)

  console.log('Prerendering routes...')
  for (const route of routes) {
    const content = prerenderRoute(template, route)
    writeRoute(route, content)
  }
  console.log('Prerender complete.')
}

main()
