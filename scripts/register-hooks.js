/**
 * Registers custom loader hooks using the stable register() API.
 * This file is used as the --import argument so hooks are registered
 * before any modules are loaded.
 */
import { register } from 'node:module'

// Use import.meta.url as the base so paths resolve correctly on all platforms
// (including Windows where absolute paths are e.g. E:\...)
register('./css-mock.js', import.meta.url)
