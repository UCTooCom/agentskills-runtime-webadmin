import type { ITreeNodeData } from '@/router/guard/menu'
import { useDeepClone } from './useDeepClone'

export function useI18nMenu(data: ITreeNodeData[], t: (key: string) => string) {
  console.log('=== useI18nMenu input data ===', data)
  const menus: ITreeNodeData[] = useDeepClone(data)
  const dfs = (menu: ITreeNodeData) => {
    // 保存原始的 permission_name，然后用国际化文本替换
    (menu as any).oldPermissionName = menu.permission_name
    menu.permission_name = t(menu.locale).toString()
    for (let i = 0; i < menu.children.length; i += 1) {
      const item = menu.children[i]
      dfs(item)
    }
  }
  for (let i = 0; i < menus.length; i += 1) {
    const menu = menus[i]
    dfs(menu)
  }
  console.log('=== useI18nMenu output menus ===', menus)
  return menus
}
