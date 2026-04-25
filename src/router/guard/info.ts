import type { LocationQueryRaw, Router } from 'vue-router'
import type { Role } from '@/store/modules/user/types'
import NProgress from 'nprogress'
import { _i18 } from '@/locale'
import { useUserStore } from '@/store'
import { useLocales } from '@/store/modules/locales'
import { setToken, getToken } from '@/utils/auth'

export default function setupInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start()
    if (to.name === 'login' || to.path === '/uctoo/entity') {
      next()
      NProgress.done()
      return
    }
    const userStore = useUserStore()
    const localesStore = useLocales()

    // 检查是否有 token
    const token = getToken()
    if (!token) {
      next({
        name: 'login',
        query: {
          redirect: to.name,
          ...to.query,
        } as LocationQueryRaw,
      })
      NProgress.done()
      return
    }

    // 检查用户信息是否已加载
    // 登录时已將用戶信息保存到 store 中，這裡不需要再調用 API
    if (!userStore.id || userStore.id === '10000') {
      // 如果 store 中沒有用戶信息，跳轉到登錄頁
      next({
        name: 'login',
        query: {
          redirect: to.name,
          ...to.query,
        } as LocationQueryRaw,
      })
      setToken('')
      NProgress.done()
      return
    }

    if (localesStore.shouldFetch) {
      await localesStore.fetchLang()
      await localesStore.fetchLocalTable()
    }
    if (localesStore.shouldMerge) {
      const entries = Object.entries(localesStore.localTable)
      for (let i = 0; i < entries.length; i += 1) {
        const lang = entries[i][0]
        const value = entries[i][1]
        _i18?.global.mergeLocaleMessage(lang, value)
      }
    }
    localesStore.$patch({
      shouldFetch: false,
      shouldMerge: false,
    })

    // 用戶信息已在登錄時設置，這裡不需要再設置
    next()
    NProgress.done()
  })
}
