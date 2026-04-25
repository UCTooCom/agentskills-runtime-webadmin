# Mock Router 迁移文档

## 概述

本文档记录了 web-admin 项目从 Mock 机制向真实 API + Pinia-ORM 架构迁移的过程。

**迁移日期**: 2026-04-13  
**迁移状态**: 进行中  
**当前阶段**: 阶段一 - 移除未使用的 Mock Router

---

## 一、迁移背景

### 1.1 旧架构（Mock 机制）

```
前端组件 → Mock Router → Mock 数据 → 前端组件
```

**特点**:
- 使用 vite-plugin-mock 插件
- Mock 数据定义在 `src/mock/` 目录
- 启动时注册所有 Mock router
- 适合前端独立开发，但与后端 API 不一致

### 1.2 新架构（Pinia-ORM + 真实 API）

```
前端组件 → Store 模型层 → axiosApi → 后端 API → 数据库
                ↓
            Pinia-ORM
                ↓
            本地状态管理
```

**特点**:
- 使用 Pinia-ORM 进行状态管理
- 统一的 axiosApi 方法调用真实 API
- 数据自动转换和持久化
- 与后端 API 保持一致

---

## 二、Router 配置分析

### 2.1 Mock Router 定义位置

| Router 路径 | 定义文件 | 用途 | 状态 |
|------------|---------|------|------|
| `/api/employee/getEmployee` | `src/mock/list.ts` | 员工列表数据 Mock | ❌ 已移除 |
| `/api/detail/getdata` | `src/mock/profile.ts` | 详情页数据 | ❌ 已移除 |
| `/api/user/data` | `src/mock/user.ts` | 用户中心数据 | ❌ 已移除 |
| `/api/base/getdata` | `src/views/form/step/mock.ts` | 基础表单初始数据 | ✅ 保留 |
| `/api/step/getdata` | `src/views/form/step/mock.ts` | 步骤表单初始数据 | ✅ 保留 |
| `/api/channel-form/submit` | `src/views/form/step/mock.ts` | 表单提交 | ✅ 保留 |
| `/api/advance/getdata` | `src/views/form/step/mock.ts` | 高级表单初始数据 | ✅ 保留 |
| `/api/user/register` | `src/mock/user.ts` | 用户注册 Mock | ✅ 保留 |
| `/api/user/userInfo` | `src/mock/user.ts` | 用户信息 Mock | ✅ 保留 |
| `/api/user/login` | `src/mock/user.ts` | 用户登录 Mock | ✅ 保留 |
| `/api/user/logout` | `src/mock/user.ts` | 用户登出 Mock | ✅ 保留 |

### 2.2 API 调用位置分析

| API 函数 | 定义文件 | 调用位置 | 状态 |
|---------|---------|---------|------|
| `getBaseData()` | `src/api/form.ts` | `src/views/form/base/index.vue` | ✅ 使用中 |
| `getStepData()` | `src/api/form.ts` | `src/views/form/step/components/collapse-form.vue` | ✅ 使用中 |
| `submitStepForm()` | `src/api/form.ts` | `src/views/form/step/components/collapse-form.vue` | ✅ 使用中 |
| `getAdvanceData()` | `src/api/form.ts` | `src/views/form/advance/index.vue` | ✅ 使用中 |
| `getUserData()` | `src/api/user.ts` | 未找到实际调用 | ❌ 已废弃 |

---

## 三、新的开发规范

### 3.1 Store 模型层架构

项目采用 **Pinia-ORM + axiosApi** 的新架构：

**目录结构**:
```
src/store/models/uctoo/
├── uctoo_user.ts          # 用户模型
├── uctoo_role.ts          # 角色模型
├── entity.ts              # 实体模型
└── ...                    # 其他模型
```

### 3.2 axiosApi 使用方式

**基本用法**:
```typescript
// 获取用户列表
import { useAxiosRepo } from '@pinia-orm/axios'
import { uctoo_user } from '@/store/models/uctoo/uctoo_user'

const userList = await useAxiosRepo(uctoo_user).api().getUctooUserList(page, pageSize, searchParams)
```

**配置结构**:
```typescript
// 模型定义
export class uctoo_user extends Model {
  static override entity = 'uctoo_user'
  
  @Uid() declare id: string
  @Str('') declare name: string
  @Str('') declare email: string
  // ... 其他字段
  
  // API 方法
  static override api() {
    return {
      getUctooUserList: (page: number, pageSize: number, params?: any) => {
        return useAxiosRepo(uctoo_user).api().get(`/api/v1/uctoo/uctoo_user/${pageSize}/${page}`, {
          params,
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          baseURL: apiURL,
          dataKey: 'data'
        })
      },
      // ... 其他 API 方法
    }
  }
}
```

### 3.3 已迁移的 API

| 功能 | 旧 API | 新 API | 状态 |
|------|--------|--------|------|
| 用户登录 | `/api/user/login` | `/api/v1/uctoo/uctoo_user/signin` | ✅ 已迁移 |
| 用户登出 | `/api/user/logout` | `/api/v1/uctoo/uctoo_user/logout` | ✅ 已迁移 |
| 获取用户列表 | - | `/api/v1/uctoo/uctoo_user/{pageSize}/{page}` | ✅ 新增 |
| 获取单个用户 | - | `/api/v1/uctoo/uctoo_user/{id}` | ✅ 新增 |
| 添加用户 | - | `/api/v1/uctoo/uctoo_user/add` | ✅ 新增 |
| 编辑用户 | - | `/api/v1/uctoo/uctoo_user/edit` | ✅ 新增 |
| 删除用户 | - | `/api/v1/uctoo/uctoo_user/del` | ✅ 新增 |

---

## 四、迁移执行记录

### 4.1 阶段一：移除未使用的 Mock Router（已完成）

**执行日期**: 2026-04-13

**移除的 Router**:

1. **`/api/employee/getEmployee`**
   - 文件: `src/mock/list.ts`
   - 原因: 无任何调用
   - 操作: 清空整个文件
   - 结果: ✅ 成功

2. **`/api/detail/getdata`**
   - 文件: `src/mock/profile.ts`
   - 原因: 无任何调用
   - 操作: 清空整个文件
   - 结果: ✅ 成功

3. **`/api/user/data`**
   - 文件: `src/mock/user.ts`
   - 原因: 已被本地实现替代
   - 操作: 移除该路由定义
   - 结果: ✅ 成功

**修改的文件**:
- `src/mock/list.ts` - 清空
- `src/mock/profile.ts` - 清空
- `src/mock/user.ts` - 移除 `/api/user/data` 路由

**验证结果**:
- ✅ 项目正常启动
- ✅ 不再显示已移除的 router 信息
- ✅ 功能正常运行

### 4.2 阶段二：迁移表单 Mock 到 Seed 机制（计划中）

**目标**: 将表单 Mock 数据迁移到 Pinia-ORM Seed 机制

**待迁移的 Router**:
- `/api/base/getdata` - 基础表单
- `/api/step/getdata` - 步骤表单
- `/api/channel-form/submit` - 表单提交
- `/api/advance/getdata` - 高级表单

**迁移方案**:

1. **创建 Seed 数据模型**:
```typescript
// src/store/models/FormOption.ts
import { Model, Uid, Str, Num } from 'pinia-orm'

export class FormOption extends Model {
  static override entity = 'formOptions'
  
  @Uid() declare id: string
  @Str('') declare type: string
  @Str('') declare label: string
  @Str('') declare value: string
  @Num(0) declare sort: number
}
```

2. **创建 Seed 数据**:
```typescript
// src/store/seeds/form.seed.ts
import { FormOption } from '@/store/models/FormOption'

export const baseFormSeed = [
  { id: '1', type: 'base', label: '项目一', value: 'project1', sort: 1 },
  { id: '2', type: 'base', label: '项目二', value: 'project2', sort: 2 },
  // ... 其他数据
]

export const stepFormSeed = [
  // ... 步骤表单数据
]
```

3. **修改 API 函数**:
```typescript
// src/api/form.ts
import { useRepo } from 'pinia-orm'
import { FormOption } from '@/store/models/FormOption'

export function getBaseData() {
  const repo = useRepo(FormOption)
  const options = repo.where('type', 'base').orderBy('sort').get()
  return Promise.resolve({ data: options })
}
```

### 4.3 阶段三：完全移除 Mock 机制（长期目标）

**目标**: 完全移除 Mock 机制，统一使用真实 API

**步骤**:
1. 禁用 vite-plugin-mock 插件
2. 移除所有 mock 文件
3. 移除 mock 相关配置
4. 统一使用 Pinia-ORM + 真实 API

---

## 五、迁移前后对比

### 5.1 启动信息对比

**迁移前**:
```
[App][Router]: [POST] /api/employee/getEmployee
[App][Router]: [GET] /api/base/getdata
[App][Router]: [GET] /api/step/getdata
[App][Router]: [POST] /api/channel-form/submit
[App][Router]: [GET] /api/advance/getdata
[App][Router]: [GET] /api/detail/getdata
[App][Router]: [GET] /api/user/getdata
[App][Router]: [GET] /api/user/getrpractic
[App][Router]: [GET] /api/user/getrtrain
[App][Router]: [POST] /api/user/getselect
[App][Router]: [POST] /api/user/register
[App][Router]: [GET] /api/user/userInfo
[App][Router]: [PUT] /api/user/userInfo
[App][Router]: [POST] /api/user/login
[App][Router]: [POST] /api/user/logout
[App][Router]: [POST] /api/user/data
```

**迁移后**:
```
[App][Router]: [GET] /api/base/getdata
[App][Router]: [GET] /api/step/getdata
[App][Router]: [POST] /api/channel-form/submit
[App][Router]: [GET] /api/advance/getdata
[App][Router]: [POST] /api/user/register
[App][Router]: [GET] /api/user/userInfo
[App][Router]: [PUT] /api/user/userInfo
[App][Router]: [POST] /api/user/login
[App][Router]: [POST] /api/user/logout
```

**减少的 Router**: 6 个

### 5.2 架构对比

| 方面 | 旧架构 | 新架构 |
|------|--------|--------|
| 数据源 | Mock 数据 | 真实 API |
| 状态管理 | Vuex | Pinia-ORM |
| API 调用 | 分散在各组件 | 统一在模型层 |
| 类型安全 | 弱类型 | 强类型（TypeScript） |
| 数据持久化 | 手动管理 | 自动管理 |
| 开发效率 | 前端独立开发 | 前后端联调 |
| 维护成本 | Mock 数据需同步 | 无需维护 Mock |

---

## 六、注意事项

### 6.1 风险提示

1. **移除前确认**: 确保没有遗漏的调用
2. **测试验证**: 在测试环境验证功能正常
3. **保留回滚方案**: 保留 Mock 文件的备份
4. **渐进式迁移**: 不要一次性移除所有 Mock

### 6.2 最佳实践

1. **优先迁移未使用的 Mock**: 降低风险
2. **保持 API 一致性**: 新旧 API 接口保持一致
3. **完善类型定义**: 使用 TypeScript 类型
4. **编写单元测试**: 确保功能正确
5. **文档同步更新**: 及时更新文档

---

## 七、后续计划

### 7.1 短期计划（1-2 周）

- [ ] 完成表单 Mock 到 Seed 机制的迁移
- [ ] 移除用户相关的 Mock（已迁移到真实 API）
- [ ] 更新相关文档

### 7.2 长期计划（1-2 月）

- [ ] 完全移除 Mock 机制
- [ ] 统一使用 Pinia-ORM + 真实 API
- [ ] 完善类型定义和单元测试
- [ ] 优化 API 调用性能

---

## 八、参考资料

### 8.1 相关文档

- [Pinia-ORM 官方文档](https://pinia-orm.cycraft.co/)
- [Mock vs Seed 对比](./mock-vs-seed-comparison.md)
- [API 规范文档](./api-specification.md)

### 8.2 相关代码

- Store 模型层: `src/store/models/uctoo/`
- API 配置: `src/api/`
- Mock 定义: `src/mock/`
- Seed 数据: `src/store/seeds/`（待创建）

---

## 九、变更记录

| 日期 | 版本 | 变更内容 | 作者 |
|------|------|---------|------|
| 2026-04-13 | v1.0 | 初始版本，记录阶段一迁移 | CodeArts Agent |

---

**文档维护者**: CodeArts Agent  
**最后更新**: 2026-04-13
