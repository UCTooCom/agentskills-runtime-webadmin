import type { Router, RouteRecordRaw } from 'vue-router'
import { nextTick } from 'vue'
import { useMenuStore } from '@/store/modules/router'
import NotFound from '@/views/not-found/404/index.vue'
import constant from '../constant'

export interface ITreeNodeData {
  // node-key='id' 设置节点的唯一标识
  id: number | string
  // 菜单名称（数据库字段 permission_name）
  permission_name: string
  // 子节点
  children?: ITreeNodeData[]
  // 路由路径（数据库字段 path）
  path: string
  // 组件
  component: string
  // 图标（数据库字段 icon）
  icon: string
  // 菜单类型（数据库字段 menu_type）
  menu_type: string
  // 父节点ID（数据库字段 parent_id）
  parent_id: number | string
  // 排序权重（数据库字段 weight）
  weight: number
  // 国际化（数据库字段 locale）
  locale: string
  // 标题（数据库字段 title）
  title?: string
  // 类型（数据库字段 type）
  type?: number
  // 是否隐藏（数据库字段 hidden）
  hidden?: number
  // 是否缓存（数据库字段 keepalive）
  keepalive?: number
}
const reg = /\.vue$/gim
let views = {} as any
if (BUILD_TOOLS === 'WEBPACK') {
  views = import.meta.webpackContext('../../views', {
    recursive: true,
    regExp: /\.vue$/,
    mode: 'sync',
  })
  views.keys().forEach((path) => {
    if (path.endsWith('.vue')) {
      views[`../../views/${path.replace('./', '')}`] = views(path).default
    }
  })
}
if (BUILD_TOOLS === 'VITE') {
  views = import.meta.glob('../../views/**/*.vue')
  console.log('VITE views:', views)
}
else if (BUILD_TOOLS === 'RSPACK') {
  const components = require.context('../../views', true, reg, 'sync')
  components.keys().forEach((path) => {
    if (path.endsWith('.vue')) {
      views[`../../views/${path.replace('./', '')}`] = components(path).default
    }
  })
}

export async function flushRouter(router: Router) {
  const menuStore = useMenuStore()
  router.clearRoutes()
  constant.forEach(staticRoute => router.addRoute(staticRoute))
  await menuStore.getMenuList()
  const routes = toRoutes(menuStore.menuList)
  routes.forEach((route) => {
    router.addRoute('root', route)
  })
}

export function toRoutes(menus: ITreeNodeData[]) {
  const router: RouteRecordRaw[] = []
  for (let i = 0; i < menus.length; i += 1) {
    const menu = menus[i]
    const path = `../../views/${menu.component}${menu.component.includes('.vue') ? '' : '.vue'}`
    if (!views[path]) {
      router.push({
        name: menu.permission_name,
        path: menu.path,
        component: NotFound,
        children: [...toRoutes(menu.children ?? [])],
        meta: {
          locale: menu.locale,
          requiresAuth: true,
        },
      })
    }
    else {
      router.push({
        name: menu.permission_name,
        path: menu.path,
        component: views[path],
        children: [...toRoutes(menu.children ?? [])],
        meta: {
          locale: menu.locale,
          requiresAuth: true,
        },
      })
    }
  }
  return router
}

export function setupMenuGuard(router: Router) {
  let has404 = false
  router.beforeEach(async (to, from, next) => {
    if (to.name?.toString().toLowerCase() === 'login') {
      next()
      return
    }
    if (!has404) {
      has404 = true
      router.addRoute({
        path: `${import.meta.env.VITE_CONTEXT}:pathMatch(.*)*`,
        name: 'notFound',
        component: () => import('@/views/not-found/index.vue'),
      })
    }
    await nextTick()
    const menuStore = useMenuStore()
    if (menuStore.menuList.length) {
      next()
      return
    }
    const data = await menuStore.getMenuList()
    const routes = toRoutes(data)
    routes.forEach((route) => {
      if (!router.hasRoute(route.name)) {
        router.addRoute('root', route)
      }
    })
    // 如果是首次加载且没有指定路由，跳转到dashboard
    if (to.path === import.meta.env.VITE_CONTEXT) {
      const dashboardRoute = routes.find(route => route.path === 'dashboard' || route.path === 'board')
      if (dashboardRoute) {
        next({ path: `${import.meta.env.VITE_CONTEXT}${dashboardRoute.path}`, replace: true })
        return
      }
    }
    next({ ...to, replace: true })
  })
}
