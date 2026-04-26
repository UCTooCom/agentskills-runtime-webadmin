import { useRepo } from 'pinia-orm'
import { Employee } from '@/store/models/Employee'

export interface QueryTaskParmas {
  pageIndex: number
  pageSize: number
  [key: string]: any
}

export interface BaseEmployeeInfo {
  name: string
  status: string
  type: string
  roles: string
  employeeNo: string
  department: string
  departmentLevel: string
  workbenchName: string
  project: string
  address: string
  createTime: string
  lastUpdateUser: string
}

export interface EmployeeInfo extends BaseEmployeeInfo {
  id: string
  rank: string
  description: string
}

export interface UpdateEmployeeInfo extends BaseEmployeeInfo {
  id: string
}

export function queryEmployeeList(params: QueryTaskParmas) {
  const repo = useRepo(Employee)
  const { pageIndex = 1, pageSize = 10 } = params

  const allEmployees = repo.all()
  const total = allEmployees.length

  // 分页
  const offset = (pageIndex - 1) * pageSize
  const data = allEmployees.slice(offset, offset + pageSize)

  return Promise.resolve({
    data: {
      total,
      data,
    },
  })
}

export function deleteEmployee(id: string) {
  const repo = useRepo(Employee)
  repo.destroy(id)

  return Promise.resolve({
    data: { success: true },
  })
}

// 新增获取员工信息的方法
export function getEmployeeInfo(id: string) {
  const repo = useRepo(Employee)
  const employee = repo.find(id)

  return Promise.resolve({
    data: employee,
  })
}

export function updateEmployeeInfo(data: any) {
  const repo = useRepo(Employee)
  repo.save(data)

  return Promise.resolve({
    data: { success: true },
  })
}
