import { Model } from 'pinia-orm';
import { Attr, Str, Uid, Num, Bool, HasOne, HasMany, BelongsTo, HasManyBy, BelongsToMany, MorphOne,
  MorphTo, MorphMany, MorphToMany, OnDelete } from 'pinia-orm/decorators';
import { useAxiosRepo } from '@pinia-orm/axios';

const apiURL = import.meta.env.VITE_BACKEND_URL || 'https://localhost:443';

export class site_info extends Model {
  static override entity = 'site_info'

  @Uid() declare id: string
  @Str('') declare site_name: string
  @Str('') declare site_title: string
  @Str('') declare site_keyword: string
  @Str('') declare site_desc: string
  @Str('') declare site_icp: string
  @Str('') declare site_police_icp: string
  @Str('') declare logo: string
  @Str('') declare creator: string | null
  @Attr('') declare created_at: string
  @Attr('') declare updated_at: string
  @Attr('') declare deleted_at: string | null

  static override config = {
    axiosApi: {
      actions: {
        getSiteInfoList(page: number, pageSize: number, searchParams?: any) {
          return useAxiosRepo(site_info).api().get(`/api/v1/uctoo/site_info/${pageSize}/${page}`, {
            params: searchParams,
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
            dataKey: 'site_infos'
          })
        },
        getSiteInfo(id: string) {
          return useAxiosRepo(site_info).api().get(`/api/v1/uctoo/site_info/${id}`, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
        addSiteInfo(data: any) {
          return useAxiosRepo(site_info).api().post('/api/v1/uctoo/site_info/add', data, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
        editSiteInfo(data: any) {
          return useAxiosRepo(site_info).api().post('/api/v1/uctoo/site_info/edit', data, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            baseURL: apiURL,
          })
        },
        deleteSiteInfo(data: any) {
          return useAxiosRepo(site_info).api().post('/api/v1/uctoo/site_info/del', data, {
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
