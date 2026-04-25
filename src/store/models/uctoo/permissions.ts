import { Model } from 'pinia-orm';
import { Attr, Str, Uid, Num, Bool, HasOne, HasMany, BelongsTo, HasManyBy, BelongsToMany, MorphOne,
  MorphTo, MorphMany, MorphToMany, OnDelete } from 'pinia-orm/decorators';
import { useAxiosRepo } from '@pinia-orm/axios';

//#region Human-Code Preservation

//#endregion Human-Code Preservation

// 使用 VITE_BACKEND_URL（install.html 配置的后端服务域名）
const apiURL = import.meta.env.VITE_BACKEND_URL || 'https://localhost:443';

export class permissions extends Model {
  static override entity = 'permissions'

  @Uid() declare id: string
  @Str('') declare permission_name: string
  @Str('') declare level: string | null
  @Str('') declare icon: string | null
  @Str('') declare module: string | null
  @Str('') declare component: string | null
  @Str('') declare redirect: string | null
  @Num(1) declare type: number
  @Num(1) declare hidden: number
  @Num(0) declare weight: number
  @Num(1) declare keepalive: number
  @Str('') declare path: string
  @Str('') declare title: string | null
  @Str('') declare parent_id: string | null
  @Str('') declare method: string | null
  @Str('') declare menu_type: string | null
  @Str('') declare locale: string | null
  @Attr(null) declare meta: any
  @Str('') declare creator: string | null
  @Attr('') declare created_at: string
  @Attr('') declare updated_at: string
  @Attr('') declare deleted_at: string | null

  static override config = {
    axiosApi: {
      actions: {
        getPermissionsList(page: number, pageSize: number, searchParams?: any) {
          return useAxiosRepo(permissions).api().get(`/api/v1/uctoo/permissions/${pageSize}/${page}`, {
            params: searchParams,
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
            dataKey: 'permissionss'
          })
        },
        getPermission(id: string) {
          return useAxiosRepo(permissions).api().get(`/api/v1/uctoo/permissions/${id}`, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
        addPermission(data: any) {
          return useAxiosRepo(permissions).api().post('/api/v1/uctoo/permissions/add', data, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
        editPermission(data: any) {
          return useAxiosRepo(permissions).api().post('/api/v1/uctoo/permissions/edit', data, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
        deletePermission(data: any) {
          return useAxiosRepo(permissions).api().post('/api/v1/uctoo/permissions/del', data, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },

//#region Human-Code Preservation
        /**
         * 获取用户菜单树 - 对接 agentskills-runtime 后端
         * 基于 V4 标准 RBAC：user -> user_has_roles -> uctoo_role -> role_has_permission -> permissions
         * @param userId 用户ID（可选，不传则使用当前登录用户）
         * @returns Promise<MenuTree[]>
         */
        getUserMenuTree(userId?: string) {
          const body = userId ? { id: userId } : {}
          return useAxiosRepo(permissions).api().post('/api/v1/uctoo/permissions/user/menu', body, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
            dataKey: 'data'
          })
        },

        /**
         * 获取所有菜单树 - 对接 agentskills-runtime 后端
         * @returns Promise<MenuTree[]>
         */
        getAllMenuTree() {
          return useAxiosRepo(permissions).api().get('/api/v1/uctoo/permissions/menu/all', {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
            dataKey: 'data'
          })
        },

        /**
         * 根据角色ID获取菜单树 - 对接 agentskills-runtime 后端
         * @param roleId 角色ID
         * @returns Promise<MenuTree[]>
         */
        getRoleMenuTree(roleId: string) {
          return useAxiosRepo(permissions).api().post('/api/v1/uctoo/permissions/role/menu', { id: roleId }, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
            dataKey: 'data'
          })
        },

        /**
         * 获取用户所有权限 - 对接 agentskills-runtime 后端
         * 不区分权限类型，返回用户角色所有的权限节点
         * @param userId 用户ID（可选，不传则使用当前登录用户）
         * @returns Promise<Permission[]>
         */
        getUserAllPermissions(userId?: string) {
          const body = userId ? { id: userId } : {}
          return useAxiosRepo(permissions).api().post('/api/v1/uctoo/permissions/user/all', body, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
            dataKey: 'data'
          })
        },
//#endregion Human-Code Preservation
      }
    }
  }
}
