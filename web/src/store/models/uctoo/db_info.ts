import { Model } from 'pinia-orm';
import { Attr, Str, Uid, Num, Bool, HasOne, HasMany, BelongsTo, HasManyBy, BelongsToMany, MorphOne,
  MorphTo, MorphMany, MorphToMany, OnDelete } from 'pinia-orm/decorators';
import { useAxiosRepo } from '@pinia-orm/axios';

//#region Human-Code Preservation

//#endregion Human-Code Preservation

// 使用 VITE_BACKEND_URL（install.html 配置的后端服务域名）
const apiURL = import.meta.env.VITE_BACKEND_URL || 'https://localhost:443';

export class db_info extends Model {
  static override entity = 'db_info'

  @Uid() declare id: string
  @Str('') declare tableCatalog: string
  @Str(null) declare tableSchema: string | null
  @Str('') declare dbTableName: string
  @Str('') declare columnName: string
  @Str(null) declare columnDefault: string | null
  @Str('') declare isNullable: string
  @Str(null) declare dataType: string | null
  @Str(null) declare vueComponentType: string | null
  @Str(null) declare reactComponentType: string | null
  @Str(null) declare arkuiComponentType: string | null
  @Str(null) declare uniappComponentType: string | null
  @Str(null) declare rules: string | null
  @Str(null) declare pattern: string | null
  @Num(null) declare weight: number | null
  @Str(null) declare creator: string | null
  @Str(null) declare placeholder: string | null
  @Str('') declare isColumnHidden: string
  @Str('') declare isTableHidden: string
  @Str(null) declare columnComment: string | null
  @Num(null) declare ordinalPosition: number | null
  @Str(null) declare migrationId: string | null
  @Num(null) declare characterMaximumLength: number | null
  @Attr('') declare created_at: string
  @Attr('') declare updated_at: string
  @Attr('') declare deleted_at: string | null

  static override config = {
    axiosApi: {
      actions: {
        getDbInfoList(page: number, pageSize: number, searchParams?: any) {
          return useAxiosRepo(db_info).api().get(`/api/v1/uctoo/db_info/${pageSize}/${page}`, {
            params: searchParams,
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
            dataKey: 'db_infos'
          })
        },
        getDbInfo(id: string) {
          return useAxiosRepo(db_info).api().get(`/api/v1/uctoo/db_info/${id}`, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
        addDbInfo(data: any) {
          return useAxiosRepo(db_info).api().post('/api/v1/uctoo/db_info/add', data, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
        editDbInfo(data: any) {
          return useAxiosRepo(db_info).api().post('/api/v1/uctoo/db_info/edit', data, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
        deleteDbInfo(data: any) {
          return useAxiosRepo(db_info).api().post('/api/v1/uctoo/db_info/del', data, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
        batchDeleteDbInfo(params: { ids: string, force?: number }) {
          return useAxiosRepo(db_info).api().post('/api/v1/uctoo/db_info/del', params, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
        batchRestoreDbInfo(ids: string[]) {
          return useAxiosRepo(db_info).api().post('/api/v1/uctoo/db_info/edit', { ids: JSON.stringify(ids), deleted_at: '0' }, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },

//#region Human-Code Preservation
    loadDbInfo(dbName: string) {
      return useAxiosRepo(db_info).api().post('/api/v1/uctoo/db_info/load-db-info', null, {
        params: { dbName },
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        baseURL: apiURL,
      })
    },

    getDbTableInfo(dbName: string, limit: number = 2000, page: number = 1) {
      return useAxiosRepo(db_info).api().get(`/api/v1/uctoo/db_info/${limit}/${page}`, {
        params: {
          filter: JSON.stringify({ table_catalog: { equals: dbName } }),
          sort: 'table_name,ordinal_position'
        },
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        baseURL: apiURL,
        dataKey: 'db_infos'
      })
    },
//#endregion Human-Code Preservation
      }
    }
  }
}

