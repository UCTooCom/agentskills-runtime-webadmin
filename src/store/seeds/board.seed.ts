// Board Mock 数据 Seed
// 数据来源：原 NestJS 后端 src/mock/data/board.ts

export const boardUserDataSeed = [
  {
    id: 'board_userData_1',
    type: 'userData',
    value: '1',
    label: 'work.mock.employees',
  },
  {
    id: 'board_userData_2',
    type: 'userData',
    value: '2',
    label: 'work.mock.onboard',
  },
  {
    id: 'board_userData_3',
    type: 'userData',
    value: '3',
    label: 'work.mock.Test',
  },
] as const

export const boardUserPracticSeed = [
  {
    id: 'board_userPractic_1',
    type: 'userPractic',
    value: '1',
    label: 'work.mock.week1',
  },
  {
    id: 'board_userPractic_2',
    type: 'userPractic',
    value: '2',
    label: 'work.mock.week2',
  },
  {
    id: 'board_userPractic_3',
    type: 'userPractic',
    value: '3',
    label: 'work.mock.week3',
  },
] as const

export const boardUserTrainSeed = [
  {
    id: 'board_userTrain_1',
    type: 'userTrain',
    value: 'work.mock.collectValue1',
    description: 'work.mock.collectDescription1',
    label1: 'work.mock.collectHotLabel1',
    label2: 'work.mock.collectLabel2',
  },
  {
    id: 'board_userTrain_2',
    type: 'userTrain',
    value: 'work.mock.collectValue2',
    description: 'work.mock.collectDescription2',
    label1: 'work.mock.collectHotLabel1',
    label2: 'work.mock.collectLabel3',
  },
  {
    id: 'board_userTrain_3',
    type: 'userTrain',
    value: 'work.mock.collectValue3',
    description: 'work.mock.collectDescription3',
    label1: 'work.mock.collectHotLabel1',
    label2: 'work.mock.collectLabel4',
  },
  {
    id: 'board_userTrain_4',
    type: 'userTrain',
    value: 'work.mock.collectValue4',
    description: 'work.mock.collectDescription4',
    label1: 'work.mock.collectHotLabel1',
    label2: 'work.mock.collectLabel5',
    isNews: true,
  },
] as const

export const boardChangeDataSeed = {
  options1: [101, 212, 122, 232],
  options2: [323, 555, 425, 2221],
  options3: [23234, 234, 989, 122],
} as const

export type BoardUserDataSeedItem = typeof boardUserDataSeed[number]
export type BoardUserPracticSeedItem = typeof boardUserPracticSeed[number]
export type BoardUserTrainSeedItem = typeof boardUserTrainSeed[number]
