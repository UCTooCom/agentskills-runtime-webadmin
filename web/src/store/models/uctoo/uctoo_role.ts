import { Model } from 'pinia-orm';
import { Attr, Str, Uid, Num, Bool, HasOne, HasMany, BelongsTo, HasManyBy, BelongsToMany, MorphOne,
  MorphTo, MorphMany, MorphToMany, OnDelete } from 'pinia-orm/decorators';
import { useAxiosRepo } from '@pinia-orm/axios';

const apiURL = import.meta.env.VITE_BACKEND_URL || 'https://localhost:443';

export class uctoo_role extends Model {
  static override entity = 'uctoo_role'

  @Uid() declare id: string
  @Str('') declare name: string
  @Str('') declare description: string | null
  @Num(0) declare status: number
  @Uid() declare creator: string
  @Attr('') declare created_at: string
  @Attr('') declare updated_at: string
  @Attr('') declare deleted_at: string | null

  static override config = {
    axiosApi: {
      actions: {
        getUctooRoleList(page: number, pageSize: number, searchParams?: any) {
          return useAxiosRepo(uctoo_role).api().get(`/api/v1/uctoo/uctoo_role/${pageSize}/${page}`, {
            params: searchParams,
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
            dataKey: 'uctoo_roles'
          })
        },
        getUctooRole(id: string) {
          return useAxiosRepo(uctoo_role).api().get(`/api/v1/uctoo/uctoo_role/${id}`, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
        addUctooRole(data: any) {
          return useAxiosRepo(uctoo_role).api().post('/api/v1/uctoo/uctoo_role/add', data, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
        editUctooRole(data: any) {
          return useAxiosRepo(uctoo_role).api().post('/uctoo/uctoo_role/edit', data, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
        deleteUctooRole(data: any) {
          return useAxiosRepo(uctoo_role).api().post('/api/v1/uctoo/uctoo_role/del', data, {
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
