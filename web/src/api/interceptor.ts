import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Modal } from '@opentiny/vue'
import locale from '@opentiny/vue-locale'
import axios from 'axios'
import router from '@/router'
import { clearToken, getToken } from '@/utils/auth'

export interface HttpResponse<T = unknown> {
  errMsg: string
  code: string | number
  data: T
}

const { VITE_BACKEND_URL, VITE_BASE_API, VITE_MOCK_IGNORE } = import.meta
  .env || { VITE_BASE_API: '', VITE_MOCK_IGNORE: '' }

// 开发环境使用代理，不设置 baseURL
// 生产环境使用 VITE_BACKEND_URL
if (import.meta.env.PROD && VITE_BACKEND_URL) {
  axios.defaults.baseURL = VITE_BACKEND_URL
}

const ignoreMockApiList = VITE_MOCK_IGNORE?.split(',') || []
axios.interceptors.request.use(
  (config: AxiosRequestConfig): any => {
    const isProxy = ignoreMockApiList.includes(config.url)
    if (isProxy) {
      config.url = config.url?.replace(VITE_BASE_API, '/api/v1')
    }

    const token = getToken()
    if (token) {
      if (!config.headers) {
        config.headers = {}
      }
      config.headers.Authorization = `Bearer ${token}`
    }

    config.headers = { ...config.headers }
    config.headers['x-lang'] = localStorage.getItem('tiny-locale') ?? 'zhCN'

    return config
  },
  (error) => {
    // do something
    return Promise.reject(error)
  },
)
// add response interceptors
axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    const res = response
    if (res.request.responseURL.includes('mock')) {
      return res.data
    }
    
    // 检查响应体中的 errno 字段，处理 40100 错误
    const responseData = res.data
    if (responseData && responseData.errno === '40100') {
      // 只有在非登录接口返回40100时才清除token并跳转到登录页面
      const isLoginApi = res.config.url?.includes('/login') || res.config.url?.includes('/auth')
      if (!isLoginApi) {
        Modal.message({
          message: responseData.errmsg || locale.t('http.error.TokenExpire'),
          status: 'error',
        })
        clearToken()
        router.replace({ name: 'login' })
      }
      return Promise.reject(new Error(responseData.errmsg || 'Authentication failed'))
    }
    
    return res
  },
  (error) => {
    const { status, data } = error.response
    if (status === 403 && error.config.method.toLowerCase() === 'get') {
      Modal.message({
        message: data.message,
        status: 'error',
      })
    }
    if (status === 401) {
      // 只有在非登录接口返回401时才清除token并跳转到登录页面
      // 登录接口返回401表示用户名或密码错误，不应该清除token
      const isLoginApi = error.config.url?.includes('/login') || error.config.url?.includes('/auth')
      if (!isLoginApi) {
        Modal.message({
          message: locale.t('http.error.TokenExpire'),
          status: 'error',
        })
        clearToken()
        router.replace({ name: 'login' })
      }
    }
    if (status === 400) {
      data.message = error.response.data.errors?.[0] ?? data.message
    }

    return Promise.reject(error)
  },
)
