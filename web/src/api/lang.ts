import axios from 'axios'

export interface Lang {
  id: string  // UUID
  name: string
  created_at?: string
  updated_at?: string
  deleted_at?: string
}
export interface CreateLangDTO {
  name: string
}

export interface LangListResponse {
  currentPage: number
  totalCount: number
  totalPage: number
  langs: Lang[]
}

export function getAllLang() {
  // 使用 agentskills-runtime 的接口，请求第一页，!100条数据
  return axios.get<LangListResponse>(`${import.meta.env.VITE_BACKEND_URL}/api/v1/uctoo/lang/100/1`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  }).then(response => {
    // 转换为前端期望的格式
    return {
      ...response,
      data: response.data.langs || []
    }
  })
}
export function createLang(data: CreateLangDTO) {
  return axios.post<Lang>(`${import.meta.env.VITE_BACKEND_URL}/api/v1/uctoo/lang/add`, data, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  })
}

export function patchLang(data: Partial<CreateLangDTO>, id: string) {
  return axios.post<Lang>(`${import.meta.env.VITE_BACKEND_URL}/api/v1/uctoo/lang/edit`, { ...data, id }, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  })
}

export function deleteLang(id: string) {
  return axios.post<{ name: string }>(`${import.meta.env.VITE_BACKEND_URL}/api/v1/uctoo/lang/del`, { id }, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  })
}
