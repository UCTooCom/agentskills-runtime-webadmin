// Profile Mock 数据 Seed
// 数据来源：原 mock/profile.ts

export const profileProjectSeed = [
  {
    id: 'profile_project_1',
    name: 'baseForm.form.label.projectone',
  },
  {
    id: 'profile_project_2',
    name: 'baseForm.form.label.projecttwo',
  },
  {
    id: 'profile_project_3',
    name: 'baseForm.form.label.projectthree',
  },
] as const

export const profileVersionSeed = [
  {
    id: 'profile_version_1',
    version: 'version1',
    operation: 'offline',
    updated: 'person1',
    time: '2022-10-11',
  },
  {
    id: 'profile_version_2',
    version: 'version2',
    operation: 'offline',
    updated: 'person2',
    time: '2022-10-12',
  },
  {
    id: 'profile_version_3',
    version: 'version3',
    operation: 'online',
    updated: 'person3',
    time: '2022-10-13',
  },
  {
    id: 'profile_version_4',
    version: 'version4',
    operation: 'online',
    updated: 'person4',
    time: '2022-10-14',
  },
  {
    id: 'profile_version_5',
    version: 'version5',
    operation: 'online',
    updated: 'person5',
    time: '2022-10-15',
  },
  {
    id: 'profile_version_6',
    version: 'version6',
    operation: 'online',
    updated: 'person6',
    time: '2022-10-16',
  },
] as const

export type ProfileProjectSeedItem = typeof profileProjectSeed[number]
export type ProfileVersionSeedItem = typeof profileVersionSeed[number]
