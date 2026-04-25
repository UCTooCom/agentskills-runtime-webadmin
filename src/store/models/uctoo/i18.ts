import { Model } from 'pinia-orm';
import { Attr, Str, Uid, Num, Bool, HasOne, HasMany, BelongsTo, HasManyBy, BelongsToMany, MorphOne,
  MorphTo, MorphMany, MorphToMany, OnDelete } from 'pinia-orm/decorators';
import { useAxiosRepo } from '@pinia-orm/axios';

const apiURL = import.meta.env.VITE_BACKEND_URL || 'https://localhost:443';

export class i18 extends Model {
  static override entity = 'i18'

  @Uid() declare id: string
  @Str('') declare key: string
  @Str('') declare content: string
  @Str('') declare lang_id: string | null
  @Str('') declare creator: string | null
  @Attr('') declare created_at: string
  @Attr('') declare updated_at: string
  @Attr('') declare deleted_at: string | null

  static override config = {
    axiosApi: {
      actions: {
        getI18List(page: number, pageSize: number, searchParams?: any) {
          return useAxiosRepo(i18).api().get(`/api/v1/uctoo/i18/${pageSize}/${page}`, {
            params: searchParams,
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
            dataKey: 'i18s'
          })
        },
        getI18(id: string) {
          return useAxiosRepo(i18).api().get(`/api/v1/uctoo/i18/${id}`, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
        addI18(data: any) {
          return useAxiosRepo(i18).api().post('/api/v1/uctoo/i18/add', data, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
        editI18(data: any) {
          return useAxiosRepo(i18).api().post('/api/v1/uctoo/i18/edit', data, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
        deleteI18(data: any) {
          return useAxiosRepo(i18).api().post('/api/v1/uctoo/i18/del', data, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },

//#region Human-Code Preservation
        /**
         * 批量删除国际化词条
         * @param ids 要删除的词条ID数组
         * @returns Promise<any>
         */
        batchDeleteI18(ids: string[]) {
          return useAxiosRepo(i18).api().post('/api/v1/uctoo/i18/del', {
            ids: JSON.stringify(ids)
          }, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
        /**
         * 获取格式化后的国际化词条树 - 对接 agentskills-runtime 后端
         * @param lang 语言名称（可选）
         * @returns Promise<Record<string, Record<string, string>>> 格式化后的国际化数据
         */
        getFormat(lang?: string) {
          return useAxiosRepo(i18).api().get('/api/v1/uctoo/i18/format', {
            params: lang ? { lang } : {},
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
