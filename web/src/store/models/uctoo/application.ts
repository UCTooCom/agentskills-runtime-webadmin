import { Model } from 'pinia-orm';
import { Attr, Str, Uid, Num, Bool, HasOne, HasMany, BelongsTo, HasManyBy, BelongsToMany, MorphOne,
  MorphTo, MorphMany, MorphToMany, OnDelete } from 'pinia-orm/decorators';
import { useAxiosRepo } from '@pinia-orm/axios';

const apiURL = import.meta.env.VITE_BACKEND_URL || 'https://localhost:443';

export class application extends Model {
  static override entity = 'application'

  @Uid() declare id: string
  @Str('') declare name: string
  @Str('') declare description: string
  @Str('') declare icon: string
  @Str('') declare tag: string
  @Str('') declare classify: string
  @Str('') declare creator: string | null
  @Attr('') declare created_at: string
  @Attr('') declare updated_at: string
  @Attr('') declare deleted_at: string | null

  static override config = {
    axiosApi: {
      actions: {
        getApplicationList(page: number, pageSize: number, searchParams?: any) {
          return useAxiosRepo(application).api().get(`/api/v1/uctoo/application/${pageSize}/${page}`, {
            params: searchParams,
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
            dataKey: 'applications'
          })
        },
        getApplication(id: string) {
          return useAxiosRepo(application).api().get(`/api/v1/uctoo/application/${id}`, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
        addApplication(data: any) {
          return useAxiosRepo(application).api().post('/api/v1/uctoo/application/add', data, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
        editApplication(data: any) {
          return useAxiosRepo(application).api().post('/api/v1/uctoo/application/edit', data, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
        deleteApplication(data: any) {
          return useAxiosRepo(application).api().post('/api/v1/uctoo/application/del', data, {
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
