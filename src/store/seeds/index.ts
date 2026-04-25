import { useRepo } from 'pinia-orm'

// 引入模型
import { BoardOption } from '../models/BoardOption'
import { Employee } from '../models/Employee'
import { ProfileVersion, ProfileProject } from '../models/ProfileData'
import { UserData } from '../models/UserData'

// 引入种子数据
import { boardUserDataSeed, boardUserPracticSeed, boardUserTrainSeed } from './board.seed'
import { employeeSeed } from './employee.seed'
import { profileProjectSeed, profileVersionSeed } from './profile.seed'
import { userChartDataSeed, userTableDataSeed } from './userData.seed'

type SeedEntry = {
  model: any // Pinia ORM Model 类
  data: readonly any[] // 种子数据数组
  key?: string // 可选：用于版本标记
  mode?: 'if-empty' | 'force' // 写入模式
}

export const seedRegistry: SeedEntry[] = [
  // Board seeds
  {
    model: BoardOption,
    data: boardUserDataSeed,
    key: 'seed_board_userData',
    mode: 'if-empty',
  },
  {
    model: BoardOption,
    data: boardUserPracticSeed,
    key: 'seed_board_userPractic',
    mode: 'if-empty',
  },
  {
    model: BoardOption,
    data: boardUserTrainSeed,
    key: 'seed_board_userTrain',
    mode: 'if-empty',
  },
  // Employee seed
  {
    model: Employee,
    data: employeeSeed,
    key: 'seed_employee',
    mode: 'if-empty',
  },
  // Profile seeds
  {
    model: ProfileProject,
    data: profileProjectSeed,
    key: 'seed_profile_project',
    mode: 'if-empty',
  },
  {
    model: ProfileVersion,
    data: profileVersionSeed,
    key: 'seed_profile_version',
    mode: 'if-empty',
  },
  // User data seeds
  {
    model: UserData,
    data: userChartDataSeed,
    key: 'seed_user_chart_data',
    mode: 'if-empty',
  },
  {
    model: UserData,
    data: userTableDataSeed,
    key: 'seed_user_table_data',
    mode: 'if-empty',
  },
]
