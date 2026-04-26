import axios from 'axios'

export interface Permission {
  desc: string
  id: number
  name: string
  type: number
}

const apiURL = import.meta.env.VITE_BACKEND_URL || 'https://localhost:443'

export function getAllPermission(page?: number, limit?: number, name?: string) {
  return axios.post(`${apiURL}/api/v1/uctoo/permissions/user/all`, {}, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  })
}

export function updatePermission(data: any) {
  return axios.patch(`${import.meta.env.VITE_BASE_API}/permission`, data)
}

export function deletePermission(id: number) {
  return axios.delete(`${import.meta.env.VITE_BASE_API}/permission/${id}`)
}

export function createPermission(data: any) {
  return axios.post(`${import.meta.env.VITE_BASE_API}/permission`, data)
}
