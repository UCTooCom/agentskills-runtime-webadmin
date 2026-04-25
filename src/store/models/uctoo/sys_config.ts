import { Model } from 'pinia-orm';
import { Attr, Str, Uid, Num, Bool, HasOne, HasMany, BelongsTo, HasManyBy, BelongsToMany, MorphOne,
  MorphTo, MorphMany, MorphToMany, OnDelete } from 'pinia-orm/decorators';
import { useAxiosRepo } from '@pinia-orm/axios';

const apiURL = import.meta.env.VITE_BACKEND_URL || 'https://localhost:443';

export class sys_config extends Model {
  static override entity = 'sys_config'

  @Uid() declare id: string
  @Str('') declare config_key: string
  @Str('') declare config_value: string
  @Str('') declare description: string | null
  @Str('') declare creator: string | null
  @Attr('') declare created_at: string
  @Attr('') declare updated_at: string
  @Attr('') declare deleted_at: string | null

  static override config = {
    axiosApi: {
      actions: {
        getSysConfigList(page: number, pageSize: number, searchParams?: any) {
          return useAxiosRepo(sys_config).api().get(`/api/v1/uctoo/sys_config/${pageSize}/${page}`, {
            params: searchParams,
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
            dataKey: 'sys_configs'
          })
        },
        getSysConfig(id: string) {
          return useAxiosRepo(sys_config).api().get(`/api/v1/uctoo/sys_config/${id}`, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
        addSysConfig(data: any) {
          return useAxiosRepo(sys_config).api().post('/api/v1/uctoo/sys_config/add', data, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
        editSysConfig(data: any) {
          return useAxiosRepo(sys_config).api().post('/api/v1/uctoo/sys_config/edit', data, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
        deleteSysConfig(data: any) {
          return useAxiosRepo(sys_config).api().post('/api/v1/uctoo/sys_config/del', data, {
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
