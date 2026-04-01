/**
 * Prerender runner.
 * Sets TSX_TSCONFIG_PATH before spawning the actual prerender.ts script,
 * so that tsx uses the app tsconfig (with "jsx": "react-jsx") for all imports.
 * This avoids needing cross-env in the build script and works on all platforms.
 */
import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// On Windows, --import requires file:// URLs for absolute paths
const registerHooksUrl = pathToFileURL(join(__dirname, 'register-hooks.js')).href
const prerenderPath = join(__dirname, 'prerender.ts')

const result = spawnSync(
  process.execPath,
  [
    '--import', 'tsx/esm',
    '--import', registerHooksUrl,
    prerenderPath,
  ],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      TSX_TSCONFIG_PATH: 'tsconfig.app.json',
    },
  },
)

if (result.status !== 0) {
  process.exit(result.status ?? 1)
}
