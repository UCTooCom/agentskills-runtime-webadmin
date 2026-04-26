import { useUserStore } from '@/store'

async function checkPermission(el: HTMLElement, binding: { value: string }) {
  const { value } = binding
  // // 获取role的permission
  const userStore = useUserStore()
  const { rolePermission } = userStore
  const permissionList: string[] = rolePermission || []
  
  // 如果权限列表为空，暂时保留元素，等待权限加载完成
  if (permissionList.length === 0) {
    return
  }
  
  // 检查是否有精确匹配
  if (permissionList.includes(value)) {
    return
  }
  
  // 检查是否有全局通配符
  if (permissionList.includes('*')) {
    return
  }
  
  // 检查是否有三段式权限匹配
  if (value.includes(':')) {
    const parts = value.split(':')
    if (parts.length === 3) {
      const module = parts[1]
      const action = parts[2]
      
      // 检查是否有模块级通配符
      if (permissionList.includes(`${parts[0]}:${module}:*`)) {
        return
      }
      
      // 检查是否有应用级通配符
      if (permissionList.includes(`${parts[0]}:*`)) {
        return
      }
    }
  }
  
  // 检查是否有通配符匹配
  for (const perm of permissionList) {
    if (perm.endsWith('*')) {
      const prefix = perm.slice(0, -1)
      if (value.startsWith(prefix)) {
        return
      }
    }
  }
  
  // 没有匹配的权限，移除元素
  el.remove()
}

export default {
  mounted(el: HTMLElement, binding: any) {
    checkPermission(el, binding)
    
    // 监听权限变化，当权限加载完成后重新检查
    const userStore = useUserStore()
    const unwatch = userStore.$subscribe((mutation, state) => {
      if (state.rolePermission && state.rolePermission.length > 0) {
        checkPermission(el, binding)
        unwatch() // 权限加载完成后取消监听
      }
    })
  },
  updated(el: HTMLElement, binding: any) {
    checkPermission(el, binding)
  },
  unmounted() {
    // 清理逻辑
  },
}
