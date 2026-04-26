import { Model } from 'pinia-orm';
import { Attr, Str, Uid, Num, Bool, HasOne, HasMany, BelongsTo, HasManyBy, BelongsToMany, MorphOne,
  MorphTo, MorphMany, MorphToMany, OnDelete } from 'pinia-orm/decorators';
import { useAxiosRepo } from '@pinia-orm/axios';

//#region Human-Code Preservation

//#endregion Human-Code Preservation

// 使用 VITE_BACKEND_URL（install.html 配置的后端服务域名）
const apiURL = import.meta.env.VITE_BACKEND_URL || 'https://localhost:443';

export class entity extends Model {
  static override entity = 'entity'

  @Uid() declare id: string
  @Str('') declare link: string
  @Num(0) declare privacy_level: number
  @Num(0) declare stars: number
  @Str('') declare description: string | null
  @Uid() declare group_id: string | null
  @Str('') declare picture: string | null
  @Str('') declare images: string | null
  @Str('') declare content: string | null
  @Str('') declare json: string | null
  @Str('') declare city: string | null
  @Num(0) declare price: number | null
  @Attr('') declare birthday: string | null
  @Str('') declare owner: string | null
  @Uid() declare creator: string
  @Attr('') declare created_at: string
  @Attr('') declare updated_at: string
  @Attr('') declare deleted_at: string | null
  @Attr('') declare end_time: string | null
  @Attr('') declare start_time: string | null
  @Str('') declare status: string | null

  static override config = {
    axiosApi: {
      actions: {
        getEntityList(page: number, pageSize: number, searchParams?: any) {
          return useAxiosRepo(entity).api().get(`/api/v1/uctoo/entity/${pageSize}/${page}`, {
            params: searchParams,
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
            dataKey: 'entitys'
          })
        },
        getEntity(id: string) {
          return useAxiosRepo(entity).api().get(`/api/v1/uctoo/entity/${id}`, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
        addEntity(data: any) {
          return useAxiosRepo(entity).api().post('/api/v1/uctoo/entity/add', data, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
        editEntity(data: any) {
          return useAxiosRepo(entity).api().post('/api/v1/uctoo/entity/edit', data, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
        deleteEntity(data: any) {
          return useAxiosRepo(entity).api().post('/api/v1/uctoo/entity/del', data, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
        batchDeleteEntity(params: { ids: string, force?: number }) {
          return useAxiosRepo(entity).api().post('/api/v1/uctoo/entity/del', params, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
        batchRestoreEntity(ids: string[]) {
          return useAxiosRepo(entity).api().post('/api/v1/uctoo/entity/edit', { ids: JSON.stringify(ids), deleted_at: '0' }, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
        emptyRecycleBin() {
          return useAxiosRepo(entity).api().post('/api/v1/uctoo/entity/empty-recycle-bin', {}, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },

//#region Human-Code Preservation

//#endregion Human-Code Preservation
      }
    }
  }
}
