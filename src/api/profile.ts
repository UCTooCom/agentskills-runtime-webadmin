import { useRepo } from 'pinia-orm'
import { ProfileVersion, ProfileProject } from '@/store/models/ProfileData'

export interface DetailTableData {
  id: string
  version: string
  operation: string
  updated: string
  time: string // YYYY-MM-DD
}

// 获取 detail 表单的初始数据选项
export function getDetailData() {
  const projectRepo = useRepo(ProfileProject)
  const versionRepo = useRepo(ProfileVersion)

  const projects = projectRepo.all().map(item => item.name)
  const tableData = versionRepo.all()

  return Promise.resolve({
    data: {
      Project: projects,
      tableData,
    },
  })
}
