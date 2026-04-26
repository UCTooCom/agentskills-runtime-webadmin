/**
 * 确保本地依赖已构建
 * 快速检查版本,仅在需要时重新构建
 */
import { execSync } from 'child_process'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const rootDir = resolve(__dirname, '..')
const nextSdkDir = resolve(rootDir, 'src/lib/webmcp-sdk/packages/next-sdk')
const nextRemoterDir = resolve(rootDir, 'src/lib/webmcp-sdk/packages/next-remoter')
const cacheFile = resolve(rootDir, '.local-deps-cache')

function getPackageJson(dir) {
  const pkgPath = resolve(dir, 'package.json')
  if (!existsSync(pkgPath)) return null
  return JSON.parse(readFileSync(pkgPath, 'utf-8'))
}

function getDirHash(dir) {
  // 简单的版本检查:package.json 版本 + dist 目录是否存在
  const pkg = getPackageJson(dir)
  if (!pkg) return null
  const distExists = existsSync(resolve(dir, 'dist'))
  return `${pkg.version}-${distExists}`
}

function needsRebuild() {
  if (!existsSync(cacheFile)) return true

  try {
    const cache = JSON.parse(readFileSync(cacheFile, 'utf-8'))
    const currentSdkHash = getDirHash(nextSdkDir)
    const currentRemoterHash = getDirHash(nextRemoterDir)

    return cache.sdk !== currentSdkHash || cache.remoter !== currentRemoterHash
  } catch {
    return true
  }
}

function updateCache() {
  const cache = {
    sdk: getDirHash(nextSdkDir),
    remoter: getDirHash(nextRemoterDir),
    timestamp: Date.now()
  }
  writeFileSync(cacheFile, JSON.stringify(cache, null, 2))
}

if (needsRebuild()) {
  console.log('🔨 检测到本地依赖需要重新构建...')

  try {
    console.log('  - 构建 next-remoter...')
    execSync('npm install && npm run build', {
      cwd: nextRemoterDir,
      stdio: 'inherit'
    })

    console.log('  - 构建 next-sdk...')
    execSync('npm install && npm run build', {
      cwd: nextSdkDir,
      stdio: 'inherit'
    })

    updateCache()
    console.log('✅ 本地依赖构建完成!')
  } catch (error) {
    console.error('❌ 构建失败:', error.message)
    process.exit(1)
  }
} else {
  console.log('✅ 本地依赖已是最新,跳过构建')
}
