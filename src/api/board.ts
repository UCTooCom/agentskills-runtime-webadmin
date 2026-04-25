import { useRepo } from 'pinia-orm'
import { BoardOption } from '@/store/models/BoardOption'
import { boardChangeDataSeed } from '@/store/seeds/board.seed'

// 获取 select 的 option - 用户数据
export function getUserData() {
  const repo = useRepo(BoardOption)
  const options = repo.where('type', 'userData').get()

  return Promise.resolve({
    data: {
      options: options.map(item => ({
        value: item.value,
        label: item.label,
      })),
    },
  })
}

// 获取实践数据
export function getUserPractic() {
  const repo = useRepo(BoardOption)
  const options = repo.where('type', 'userPractic').get()

  return Promise.resolve({
    data: {
      options: options.map(item => ({
        value: item.value,
        label: item.label,
      })),
    },
  })
}

// 获取培训数据
export function getUserTrain() {
  const repo = useRepo(BoardOption)
  const options = repo.where('type', 'userTrain').get()

  return Promise.resolve({
    data: {
      options: options.map(item => ({
        value: item.value,
        description: item.description,
        label1: item.label1,
        label2: item.label2,
        isNews: item.isNews,
      })),
    },
  })
}

// 切换数据源
export function getUserChange(data: string) {
  const selectValue = Number.parseInt(data, 10)

  let result: number[]
  if (selectValue === 1) {
    result = boardChangeDataSeed.options1
  }
  else if (selectValue === 2) {
    result = boardChangeDataSeed.options2
  }
  else {
    result = boardChangeDataSeed.options3
  }

  return Promise.resolve({
    data: result,
  })
}
