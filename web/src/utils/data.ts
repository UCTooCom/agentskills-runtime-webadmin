/**
 * 数据处理工具函数
 */

/**
 * 移除对象中的 null 和 undefined 值
 * 用于编辑模式，保留空字符串（因为空字符串可能是有效值）
 * @param obj 要处理的对象
 * @returns 处理后的新对象
 */
export function removeNull(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]
      // 只移除 null 和 undefined，保留空字符串、0、false 等有效值
      if (value !== null && value !== undefined) {
        result[key] = value
      }
    }
  }
  
  return result
}

/**
 * 移除对象中的 null、undefined 和空字符串
 * 用于新增模式，避免提交无意义的空值
 * @param obj 要处理的对象
 * @returns 处理后的新对象
 */
export function removeEmpty(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]
      // 移除 null、undefined 和空字符串，但保留 0、false 等有效值
      if (value !== null && value !== undefined && value !== '') {
        result[key] = value
      }
    }
  }
  
  return result
}

/**
 * 深度比较两个对象，返回修改的字段
 * @param original 原始对象
 * @param current 当前对象
 * @returns 只包含修改字段的对象
 */
export function getChangedFields(
  original: Record<string, any>,
  current: Record<string, any>
): Record<string, any> {
  const changed: Record<string, any> = {}
  
  for (const key in current) {
    if (current.hasOwnProperty(key)) {
      const originalValue = original[key]
      const currentValue = current[key]
      
      // 比较值是否发生变化
      if (!isEqual(originalValue, currentValue)) {
        changed[key] = currentValue
      }
    }
  }
  
  // 确保包含 id 字段（用于标识记录）
  if (original.id !== undefined) {
    changed.id = original.id
  }
  
  return changed
}

/**
 * 深度比较两个值是否相等
 * @param a 值 a
 * @param b 值 b
 * @returns 是否相等
 */
function isEqual(a: any, b: any): boolean {
  // 处理 null、undefined 和空字符串的等价性
  // 在表单中，null、undefined 和空字符串通常被视为相同
  const isEmptyA = a === null || a === undefined || a === ''
  const isEmptyB = b === null || b === undefined || b === ''
  
  if (isEmptyA && isEmptyB) {
    return true
  }
  
  if (isEmptyA || isEmptyB) {
    return false
  }
  
  // 处理基本类型
  if (typeof a !== 'object' || typeof b !== 'object') {
    return a === b
  }
  
  // 处理日期对象
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime()
  }
  
  // 处理数组
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false
    }
    return a.every((item, index) => isEqual(item, b[index]))
  }
  
  // 处理对象
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  
  if (keysA.length !== keysB.length) {
    return false
  }
  
  return keysA.every(key => isEqual(a[key], b[key]))
}
