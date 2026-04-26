import type { IPaginationMeta } from '@/types/global'
import axios from 'axios'

export interface Role {
  id: number
  name: string
  permission: {
    name: string
    desc: string
    id: number
  }[]
}
export interface GetAllRoleDetailRet {
  roleInfo: {
    meta: IPaginationMeta
    items: Role[]
  }
  menuTree: any[]
}

export function getAllRole() {
  return axios.get(`${import.meta.env.VITE_BASE_API}/role`)
}

// 获取所有角色详情 - 使用 store 模型库方法
// 注意：此方法已废弃，请使用 store/models/uctoo/uctoo_role 中的 getUctooRoleList 方法
export function getAllRoleDetail(page = 1, limit = 10, name?: string) {
  // 此方法保留用于向后兼容，但建议使用 store 模型库
  console.warn('getAllRoleDetail is deprecated, use uctoo_role.getUctooRoleList instead')
  return axios.get<GetAllRoleDetailRet>(`${import.meta.env.VITE_BASE_API}/role/detail`, {
    params: { page, limit, name },
  })
}

export function updateRole(data: any) {
  return axios.patch(`${import.meta.env.VITE_BASE_API}/role`, data)
}

export function deleteRole(id: number) {
  return axios.delete(`${import.meta.env.VITE_BASE_API}/role/${id}`)
}

export function createRole(data: any) {
  return axios.post(`${import.meta.env.VITE_BASE_API}/role`, data)
}

export function getRoleInfo(id: number) {
  return axios.get(`${import.meta.env.VITE_BASE_API}/role/info/${id}`)
}
