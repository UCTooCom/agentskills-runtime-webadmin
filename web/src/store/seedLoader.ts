import { useRepo } from 'pinia-orm'
import { seedRegistry } from './seeds'

// 统一存储工具（兼容 Web）
function getStorage(key: string): string | null {
  try {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null
  }
  catch {
    return null
  }
}

function setStorage(key: string, value: string) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value)
    }
  }
  catch {
    // ignore
  }
}

export type RunSeedsOptions = {
  // 全局强制写入（覆盖）
  force?: boolean
  // 全局版本号（变更时可触发重写）
  version?: string
}

// 幂等写入：默认仅当仓库为空时写入；force 为真则覆盖
async function applySeed(model: any, data: readonly any[], mode: 'if-empty' | 'force') {
  const repo = useRepo(model)
  if (mode === 'force') {
    repo.flush()
    repo.save(data as any[])
    return
  }
  // if-empty 模式
  const count = repo.all().length
  if (count === 0) {
    repo.save(data as any[])
  }
}

export async function runSeeds(options: RunSeedsOptions = {}) {
  const { force = false, version } = options

  // 版本标记：若版本变化，触发一次全量覆盖写入
  let effectiveForce = force
  const versionKey = '__pinia_orm_seed_version__'
  if (version) {
    const stored = getStorage(versionKey)
    if (stored !== version) {
      effectiveForce = true
    }
  }

  for (const entry of seedRegistry) {
    const mode = effectiveForce ? 'force' : (entry.mode ?? 'if-empty')
    try {
      await applySeed(entry.model, entry.data, mode)
      // 针对单条种子设置单独标记（可按需用）
      if (entry.key && effectiveForce) {
        setStorage(entry.key, 'applied')
      }
    }
    catch (e) {
      console.error('[Seed] apply failed:', entry.model?.entity || entry.key, e)
    }
  }

  if (version) {
    setStorage(versionKey, version)
  }
}
