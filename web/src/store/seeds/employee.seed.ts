// Employee Mock 数据 Seed
// 数据来源：原 mock/list.ts

// 生成 60 条员工数据
function generateEmployeeData() {
  const employees = []
  const statuses = ['0', '1', '2']

  for (let i = 1; i <= 60; i++) {
    employees.push({
      id: `employee_${i}`,
      name: 'xiaoming',
      rank: '初级',
      description: '一段描述文字',
      createTime: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      status: statuses[Math.floor(Math.random() * 3)],
      type: 'Tiny Design',
      roles: '前端',
      employeeNo: '00022456',
      department: '公共服务',
      departmentLevel: '中级',
      workbenchName: 'work',
      project: 'TinyDesign',
      address: '西安研究所',
      lastUpdateUser: '张三',
    })
  }

  return employees
}

export const employeeSeed = generateEmployeeData() as const

export type EmployeeSeedItem = typeof employeeSeed[number]
