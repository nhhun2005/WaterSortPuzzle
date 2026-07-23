// Minimal resolver so Node can load Vite-style extensionless relative imports
// (e.g. "../lib/gameLogic") during standalone verification.
import { existsSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'

export async function resolve(specifier, context, nextResolve) {
  if ((specifier.startsWith('./') || specifier.startsWith('../')) && !/\.[mc]?js$/.test(specifier)) {
    try {
      const base = context.parentURL ?? pathToFileURL(process.cwd() + '/').href
      const resolvedUrl = new URL(specifier, base)
      const path = fileURLToPath(resolvedUrl)
      if (existsSync(`${path}.js`)) {
        return nextResolve(`${specifier}.js`, context)
      }
    } catch {
      // fall through to default resolution
    }
  }
  return nextResolve(specifier, context)
}
