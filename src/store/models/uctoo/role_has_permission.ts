import { Model } from 'pinia-orm';
import { Attr, Str, Uid, Num, Bool, HasOne, HasMany, BelongsTo, HasManyBy, BelongsToMany, MorphOne,
  MorphTo, MorphMany, MorphToMany, OnDelete } from 'pinia-orm/decorators';
import { useAxiosRepo } from '@pinia-orm/axios';

const apiURL = import.meta.env.VITE_BACKEND_URL || 'https://localhost:443';

export class role_has_permission extends Model {
  static override entity = 'role_has_permission'

  @Uid() declare role_id: string
  @Str('') declare permission_name: string
  @Num(0) declare status: number
  @Str('') declare creator: string | null
  @Attr('') declare created_at: string
  @Attr('') declare updated_at: string
  @Attr('') declare deleted_at: string | null

  static override config = {
    axiosApi: {
      actions: {
        getRoleHasPermissionList(page: number, pageSize: number, searchParams?: any) {
          return useAxiosRepo(role_has_permission).api().get(`/api/v1/uctoo/role_has_permission/${pageSize}/${page}`, {
            params: searchParams,
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
            dataKey: 'role_has_permissions'
          })
        },
        addRoleHasPermission(data: any) {
          return useAxiosRepo(role_has_permission).api().post('/api/v1/uctoo/role_has_permission/add', data, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
        deleteRoleHasPermission(data: any) {
          return useAxiosRepo(role_has_permission).api().post('/api/v1/uctoo/role_has_permission/del', data, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
      }
    }
  }
}
