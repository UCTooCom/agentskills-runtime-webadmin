import type { Lang } from './lang'
import axios from 'axios'

export interface I18Table {
  [lang: string]: {
    [key: string]: string
  }
}
export interface Locals {
  items: Local[]
  meta: Meta
}
export interface Local {
  content: string
  id: string  // UUID
  key: string
  lang: Lang
}
export interface Meta {
  currentPage: number
  itemCount: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
}
export interface CreateLocal {
  content: string
  key: string
  lang: string  // UUID
}
export interface CreateLocalReturn {
  content: string
  id: string
  key: string
  lang: Lang
}

type DeleteLocaleRet = Omit<CreateLocalReturn, 'id'>

export function getLocalTable(lang?: string) {
  // 使用 agentskills-runtime 的接口
  return axios.get<I18Table>(`${import.meta.env.VITE_BACKEND_URL}/api/v1/uctoo/i18/format`, {
    params: { lang },
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  })
}

export function getAllLocalItems(page?: number, limit?: number, all?: number, filters?: {
  [x: string]: number[] | string
}) {
  // 如果请求全部数据，使用 /all 接口
  if (all === 1) {
    return axios.get<Local[]>(`${import.meta.env.VITE_BACKEND_URL}/api/v1/uctoo/i18/all`, {
      params: { ...filters },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    }).then(response => {
      // 转换为前端期望的格式
      return {
        ...response,
        data: {
          items: response.data,
          meta: {
            currentPage: 1,
            itemCount: response.data.length,
            itemsPerPage: response.data.length,
            totalItems: response.data.length,
            totalPages: 1
          }
        }
      }
    })
  }
  
  // 分页查询
  return axios.get<Locals>(`${import.meta.env.VITE_BACKEND_URL}/api/v1/uctoo/i18/${limit || 10}/${page || 1}`, {
    params: { ...filters },
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  })
}

export function createLocalItem(data: CreateLocal) {
  return axios.post<CreateLocalReturn>(`${import.meta.env.VITE_BACKEND_URL}/api/v1/uctoo/i18/add`, data, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  })
}
export function deleteLocale(id: string) {
  return axios.post<DeleteLocaleRet>(`${import.meta.env.VITE_BACKEND_URL}/api/v1/uctoo/i18/del`, { id }, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  })
}

export function patchLocal(id: string, data: Partial<CreateLocal>) {
  return axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/uctoo/i18/edit`, { ...data, id }, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  })
}

export function batchDeleteLocal(ids: string[]) {
  return axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/uctoo/i18/del`, { ids: JSON.stringify(ids) }, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  })
}
