import { Model } from 'pinia-orm';
import { Attr, Str, Uid, Num, Bool, HasOne, HasMany, BelongsTo, HasManyBy, BelongsToMany, MorphOne,
  MorphTo, MorphMany, MorphToMany, OnDelete } from 'pinia-orm/decorators';
import { useAxiosRepo } from '@pinia-orm/axios';

const apiURL = import.meta.env.VITE_BACKEND_URL || 'https://localhost:443';

export class user_has_roles extends Model {
  static override entity = 'user_has_roles'

  @Uid() declare id: string
  @Uid() declare user_id: string
  @Uid() declare role_id: string
  @Attr('') declare created_at: string
  @Attr('') declare updated_at: string

  static override config = {
    axiosApi: {
      actions: {
        getUserHasRolesList(page: number, pageSize: number, searchParams?: any) {
          return useAxiosRepo(user_has_roles).api().get(`/api/v1/uctoo/user_has_roles/${pageSize}/${page}`, {
            params: searchParams,
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
            dataKey: 'user_has_roless'
          })
        },
        addUserHasRole(data: any) {
          return useAxiosRepo(user_has_roles).api().post('/api/v1/uctoo/user_has_roles/add', data, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
        deleteUserHasRole(data: any) {
          return useAxiosRepo(user_has_roles).api().post('/api/v1/uctoo/user_has_roles/del', data, {
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
