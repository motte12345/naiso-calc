/**
 * Node.js module loader hook.
 * CSS Modules and static assets are not executable in Node.js.
 * This hook intercepts those imports and returns safe mock values
 * so that prerender.ts can import React components without errors.
 *
 * It also forces ESM-compatible resolution for packages that expose
 * both CJS and ESM builds (e.g. react-helmet-async), where tsx would
 * otherwise pick the CJS build under the "node" condition and break
 * named imports.
 */

const CSS_PATTERN = /\.module\.(css|scss|sass|less)$/
const ASSET_PATTERN = /\.(css|svg|png|jpg|jpeg|gif|webp|avif|woff|woff2|ttf|eot)$/

/**
 * Packages whose "node" CJS condition breaks named ESM imports.
 * For these we strip the "node" condition so the "import" (ESM) path is used.
 */
const FORCE_ESM_PACKAGES = new Set(['react-helmet-async'])

export async function resolve(specifier, context, nextResolve) {
  if (CSS_PATTERN.test(specifier) || ASSET_PATTERN.test(specifier)) {
    return {
      shortCircuit: true,
      url: new URL(`mock:${specifier}`).href,
    }
  }

  // Force ESM resolution for specific packages.
  // react-helmet-async's CJS build internally require()s its ESM file which
  // causes ERR_REQUIRE_CYCLE_MODULE on Node 24. We bypass this by pointing
  // directly at the ESM build.
  if (specifier === 'react-helmet-async') {
    return {
      shortCircuit: true,
      url: new URL(
        '../node_modules/react-helmet-async/lib/index.esm.js',
        import.meta.url,
      ).href,
    }
  }

  return nextResolve(specifier, context)
}

export async function load(url, context, nextLoad) {
  if (url.startsWith('mock:')) {
    const isCssModule = CSS_PATTERN.test(url)
    if (isCssModule) {
      // Return a Proxy so that any className lookup returns an empty string
      const source = `
        export default new Proxy({}, { get: () => '' });
      `
      return { format: 'module', shortCircuit: true, source }
    }
    return {
      format: 'module',
      shortCircuit: true,
      source: `export default ''`,
    }
  }
  return nextLoad(url, context)
}
