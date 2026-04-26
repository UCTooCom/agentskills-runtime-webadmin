import { Model } from 'pinia-orm';
import { Attr, Str, Uid, Num, Bool, HasOne, HasMany, BelongsTo, HasManyBy, BelongsToMany, MorphOne,
  MorphTo, MorphMany, MorphToMany, OnDelete } from 'pinia-orm/decorators';
import { useAxiosRepo } from '@pinia-orm/axios';

//#region Human-Code Preservation

//#endregion Human-Code Preservation

// 使用相对路径，通过代理服务器发送请求，避免跨域问题
const apiURL = import.meta.env.VITE_BACKEND_URL || 'https://localhost:443';

export class uctoo_user extends Model {
  static override entity = 'uctoo_user'

  @Uid() declare id: string
  @Str('') declare email: string
  @Str('') declare name: string
  @Str('') declare username: string
  @Str('') declare password: string
  @Str('') declare avatar: string | null
  @Str('') declare phone: string | null
  @Num(0) declare status: number
  @Str('') declare last_login_at: string | null
  @Uid() declare creator: string
  @Attr('') declare created_at: string
  @Attr('') declare updated_at: string
  @Attr('') declare deleted_at: string | null
  @Str('') declare access_token: string | null

  static override config = {
    axiosApi: {
      actions: {
        getUctooUserList(page: number, pageSize: number, searchParams?: any) {
          return useAxiosRepo(uctoo_user).api().get(`/api/v1/uctoo/uctoo_user/${pageSize}/${page}`, {
            params: searchParams,
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
            dataKey: 'uctoo_users'
          })
        },
        getUctooUser(id: string) {
          return useAxiosRepo(uctoo_user).api().get(`/api/v1/uctoo/uctoo_user/${id}`, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
        addUctooUser(data: any) {
          return useAxiosRepo(uctoo_user).api().post('/api/v1/uctoo/uctoo_user/add', data, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
        editUctooUser(data: any) {
          return useAxiosRepo(uctoo_user).api().post('/api/v1/uctoo/uctoo_user/edit', data, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
        deleteUctooUser(data: any) {
          return useAxiosRepo(uctoo_user).api().post('/api/v1/uctoo/uctoo_user/del', data, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },

//#region Human-Code Preservation
        /**
         * 用户登录 - 对接 agentskills-runtime 后端
         * 支持邮箱或用户名登录
         * @param data 登录数据 { email?, username?, password }
         * @returns Promise<{ errno, errmsg, data: { access_token, access_token_ttl, refresh_token, refresh_token_ttl, uctoo_user } }>
         */
        login(data: { email?: string; username?: string; password: string }) {
          return useAxiosRepo(uctoo_user).api().post('/api/v1/uctoo/uctoo_user/signin', data, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
            },
            baseURL: apiURL,
            dataTransformer: (response) => {
              // 从响应数据中提取 uctoo_user
              const responseData = response.data
              if (responseData.errno === '0' || responseData.errno === 0) {
                const { uctoo_user } = responseData.data
                // 将 access_token 添加到用户对象中
                if (uctoo_user) {
                  uctoo_user.access_token = responseData.data.access_token
                  // 角色和权限信息已经在 uctoo_user 中，无需额外处理
                }
                return uctoo_user
              }
              return null
            },
          })
        },

        /**
         * 用户登出 - 对接 agentskills-runtime 后端
         * @returns Promise<void>
         */
        logout() {
          return useAxiosRepo(uctoo_user).api().post('/api/v1/uctoo/uctoo_user/logout', {}, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },

        /**
         * 获取当前用户信息 - 对接 agentskills-runtime 后端
         * @returns Promise<User>
         */
        getCurrentUser() {
          return useAxiosRepo(uctoo_user).api().get('/api/v1/uctoo/uctoo_user/me', {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },

        /**
         * 根据邮箱查找用户 - 对接 agentskills-runtime 后端
         * @param email 用户邮箱
         * @returns Promise<User>
         */
        findByEmail(email: string) {
          return useAxiosRepo(uctoo_user).api().get(`/api/v1/uctoo/uctoo_user/by-email/${encodeURIComponent(email)}`, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },

        /**
         * 重置密码 - 对接 agentskills-runtime 后端
         * @param data { user_id, old_password, new_password }
         * @returns Promise<void>
         */
        resetPassword(data: { user_id: string; old_password: string; new_password: string }) {
          return useAxiosRepo(uctoo_user).api().post('/api/v1/uctoo/uctoo_user/resetpassword', data, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
//#endregion Human-Code Preservation
      }
    }
  }
}
