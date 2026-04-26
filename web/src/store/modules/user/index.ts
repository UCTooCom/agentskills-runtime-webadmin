import type { UserInfo, UserState } from './types'
import type {
  LoginData,
  LoginDataMail,
} from '@/api/user'
import { defineStore } from 'pinia'
import { getRoleInfo } from '@/api/role'
import {
  flushToken,
  getUserInfo,
  updateUserInfo,
  login as userLogin,
  loginMail as userLoginMail,
  logout as userLogout,
} from '@/api/user'
import { clearToken, getRefreshToken, getToken, setRefreshToken, setToken } from '@/utils/auth'
import { removeRouteListener } from '@/utils/route-listener'
import { useAxiosRepo } from '@pinia-orm/axios'
import { uctoo_user } from '@/store/models/uctoo/uctoo_user'

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: '10000',
    name: 'admin',
    email: 'admin@no-reply.com',
    department: 'Tiny-Vue-Pro',
    employeeType: 'social recruitment',
    job: 'Front end',
    probationStart: '2021-04-19',
    probationEnd: '2021-10-15',
    probationDuration: '180',
    protocolStart: '2021-04-19',
    protocolEnd: '2024-04-19',
    address: '',
    status: '',
    role: [],
    sort: 1,
    startTime: '',
    endTime: '',
    filterStatus: [],
    filterType: [],
    submit: false,
    reset: false,
    roleId: 0,
    rolePermission: [],
    refreshToken: getRefreshToken(),
    accessToken: getToken(),
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return state
    },
  },

  actions: {
    switchRoles() {
      return new Promise((resolve) => {
        this.role = this.role === 'user' ? 'admin' : 'user'
        resolve(this.role)
      })
    },
    // Set user's information
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial)
    },

    // Reset user's information
    resetInfo() {
      this.$reset()
    },
    flushToken() {
      const refreshToken = this.refreshToken as string
      flushToken({ token: refreshToken })
        .then((tokenPair) => {
          return tokenPair.data
        })
        .then((data) => {
          this.refreshToken = data.refreshToken
          this.accessToken = data.accessToken
          setRefreshToken(data.refreshToken)
          setToken(data.accessToken)
        })
    },

    // Reset filter information
    resetFilterInfo() {
      this.startTime = ''
      this.endTime = ''
      this.filterStatus = []
      this.filterType = []
    },

    async updateInfo(data: Partial<UserInfo>) {
      const res = await updateUserInfo(data)
      this.setInfo(res.data)
    },

    // Login - 使用 pinia-orm 对接 agentskills-runtime
    async login(loginForm: LoginData) {
      console.log('userStore.login called with:', loginForm)
      try {
        // 直接调用 uctoo_user model 的 login action
        const uctooUserRepo = useAxiosRepo(uctoo_user)
        console.log('uctooUserRepo:', uctooUserRepo)
        console.log('Calling uctooUserRepo.api().login...')
        
        const res = await uctooUserRepo.api().login({
          email: loginForm.email,
          password: loginForm.password,
        })

        console.log('login response:', res)
        console.log('login response.response:', res.response)
        console.log('login response.entities:', res.entities)
        
        // res 是 pinia-orm/axios 的 Response 对象
        // res.response 是 AxiosResponse
        // res.entities 是已保存到 store 的用户数据
        const responseData = res.response.data
        console.log('responseData:', responseData)
        
        if (responseData.errno === '0' || responseData.errno === 0) {
          const { access_token, access_token_ttl, refresh_token_ttl } = responseData.data
          
          // 存储 token
          this.accessToken = access_token
          setToken(access_token)
          
          // 存储 Token TTL 信息
          if (access_token_ttl) {
            localStorage.setItem('accessTokenTTL', access_token_ttl.toString())
          }
          if (refresh_token_ttl) {
            localStorage.setItem('refreshTokenTTL', refresh_token_ttl.toString())
          }

          // pinia-orm/axios 已经自动保存用户数据到 store 中
          // 从 res.entities 获取已保存的用户数据
          if (res.entities && res.entities.length > 0) {
            const savedUser = res.entities[0]
            console.log('savedUser:', savedUser)
            
            // 获取角色和权限信息
            const roles = (savedUser as any).roles || []
            const permissions = (savedUser as any).permissions || []
            
            // 存储角色和权限信息到 localStorage
            localStorage.setItem('userRoles', JSON.stringify(roles))
            localStorage.setItem('userPermissions', JSON.stringify(permissions))
            
            const userInfo = {
              id: savedUser.id,
              name: savedUser.name || savedUser.username,
              email: savedUser.email,
              role: roles.join(','),
              department: '',
              employeeType: '',
              job: '',
              probationStart: '',
              probationEnd: '',
              probationDuration: '',
              protocolStart: '',
              protocolEnd: '',
              address: '',
              status: '',
              roleId: 0,
              rolePermission: permissions,
            }
            this.setInfo(userInfo)
          }
        } else {
          throw new Error(responseData.errmsg || '登录失败')
        }
      }
      catch (err) {
        console.error('login error:', err)
        clearToken()
        throw err
      }
    },

    async loginMail(loginForm: LoginDataMail) {
      try {
        const res = await userLoginMail(loginForm)
        setToken(res.data.token)
      }
      catch (err) {
        clearToken()
        throw err
      }
    },

    // Logout - 使用 pinia-orm 对接 agentskills-runtime
    async logout() {
      try {
        await useAxiosRepo(uctoo_user).api().logout()
      } catch (e) {
        // 忽略登出错误
      }
      this.resetInfo()
      clearToken()
      removeRouteListener()
    },
  },

  // 启用持久化，持久化关键的用户信息
  persist: {
    key: 'user-store',
    storage: localStorage,
    paths: ['accessToken', 'refreshToken', 'id', 'name', 'email', 'role', 'rolePermission', 'roleId'],
  },
})

export default useUserStore
