/**
 * 清理 Vite 缓存和本地依赖构建产物
 * 用于解决 npm install 后的缓存问题
 */
import { execSync } from 'child_process'
import { existsSync, rmSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const rootDir = resolve(__dirname, '..')
const nodeModulesVite = resolve(rootDir, 'node_modules', '.vite')
const nextSdkDist = resolve(rootDir, 'src/lib/webmcp-sdk/packages/next-sdk/dist')
const nextRemoterDist = resolve(rootDir, 'src/lib/webmcp-sdk/packages/next-remoter/dist')

console.log('🧹 开始清理缓存...')

// 清理 Vite 缓存
if (existsSync(nodeModulesVite)) {
  console.log('  - 清理 Vite 缓存:', nodeModulesVite)
  rmSync(nodeModulesVite, { recursive: true, force: true })
}

// 清理 next-sdk 构建产物
if (existsSync(nextSdkDist)) {
  console.log('  - 清理 next-sdk 构建产物:', nextSdkDist)
  rmSync(nextSdkDist, { recursive: true, force: true })
}

// 清理 next-remoter 构建产物
if (existsSync(nextRemoterDist)) {
  console.log('  - 清理 next-remoter 构建产物:', nextRemoterDist)
  rmSync(nextRemoterDist, { recursive: true, force: true })
}

console.log('✅ 缓存清理完成!')

// 重新构建本地依赖
console.log('\n🔨 重新构建本地依赖...')

try {
  console.log('  - 构建 next-remoter...')
  execSync('npm install && npm run build', {
    cwd: resolve(rootDir, 'src/lib/webmcp-sdk/packages/next-remoter'),
    stdio: 'inherit'
  })

  console.log('  - 构建 next-sdk...')
  execSync('npm install && npm run build', {
    cwd: resolve(rootDir, 'src/lib/webmcp-sdk/packages/next-sdk'),
    stdio: 'inherit'
  })

  console.log('\n✅ 本地依赖构建完成!')
} catch (error) {
  console.error('\n❌ 构建失败:', error.message)
  process.exit(1)
}
