import type { LocationQueryRaw, Router } from 'vue-router'
import { Modal } from '@opentiny/vue'
import { t } from '@opentiny/vue-locale'
import NProgress from 'nprogress' // progress bar
import { nextTick } from 'vue'
import { clearToken, isLogin } from '@/utils/auth'

export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start()
    if (!isLogin()) {
      if (to.name === 'login' || to.path === '/uctoo/entity') {
        next()
        NProgress.done()
        return
      }
      await nextTick()
      Modal.message({
        message: t('http.error.TokenExpire'),
        status: 'error',
      })
      await nextTick()
      // 清除token
      clearToken()
      next({
        name: 'login',
        query: {
          redirect: to.name,
          ...to.query,
        } as LocationQueryRaw,
      })
      NProgress.done()
    }
    else {
      next()
      NProgress.done()
    }
  })
}
