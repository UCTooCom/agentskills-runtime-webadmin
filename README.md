# UCToo Web Admin

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-4.0.0-blue.svg)]()
[![Vue](https://img.shields.io/badge/vue-3.5+-green.svg)](https://vuejs.org/)

## 项目简介

UCToo Web Admin 是 UCToo v4 管理后台的 PC 前端项目，基于 Vue 3 + TypeScript + OpenTiny Vue 构建。采用 UMI 全栈模型同构架构设计，实现了前后端数据模型同构、状态管理同构、API 调用同构。

## 技术架构

### UMI 全栈模型同构架构

本项目遵循 UMI（Unified Model Interface）全栈模型同构架构设计理念：

- **数据模型同构**：前端使用 Pinia ORM 定义与后端完全一致的数据模型
- **状态管理同构**：通过 Pinia ORM 实现服务端状态的前端缓存与同步
- **API 调用同构**：模型层直接集成 API 调用方法，实现数据获取与状态管理一体化

### 技术栈

- **前端框架**：Vue 3.5+ + TypeScript
- **UI 组件库**：OpenTiny Vue 3.28+
- **状态管理**：Pinia 2.1.7 + Pinia ORM 1.10.2
- **HTTP 客户端**：Axios 1.7.9
- **构建工具**：Vite / Webpack / Rspack / Farm（多构建工具支持）
- **路由**：Vue Router 4.4.5
- **国际化**：Vue I18n 11.0.0
- **AI 集成**：@opencangjie/skills SDK + WebMCP SDK

> **注：** nestJs 后端服务仅用于 start-installer.bat 快捷安装过程，实际支撑 web 端业务的服务器端 API 均由 agentskills-runtime 提供。

## 项目结构

```
web-admin/
├── nestJs/                 # NestJS 后端服务
│   ├── src/               # 后端源码
│   ├── package.json       # 后端依赖
│   └── ...
├── web/                   # Vue 前端项目
│   ├── src/
│   │   ├── api/          # API 接口定义（传统方式，已逐步迁移到模型中）
│   │   ├── assets/       # 静态资源
│   │   ├── components/   # 公共组件
│   │   ├── hooks/        # 组合式函数
│   │   ├── layout/       # 布局组件
│   │   ├── locale/       # 国际化配置
│   │   ├── router/       # 路由配置
│   │   ├── store/        # 状态管理
│   │   │   ├── models/   # ORM 数据模型（UMI 同构核心）
│   │   │   │   └── uctoo/
│   │   │   │       ├── uctoo_user.ts      # 用户模型 + API 方法
│   │   │   │       ├── uctoo_role.ts      # 角色模型 + API 方法
│   │   │   │       ├── permissions.ts     # 权限模型 + API 方法
│   │   │   │       └── ...
│   │   │   └── modules/  # Pinia 状态模块
│   │   ├── utils/        # 工具函数
│   │   └── views/        # 页面视图
│   ├── config/           # 构建配置
│   ├── public/           # 公共资源
│   └── package.json      # 前端依赖
└── start-installer.bat   # 一键安装启动脚本
```

## 核心特性

### 1. UMI 全栈模型同构

数据模型定义在 `src/store/models/uctoo/` 目录下，每个模型同时定义数据结构和 API 调用方法：

```typescript
// src/store/models/uctoo/uctoo_user.ts
import { Model } from 'pinia-orm';
import { useAxiosRepo } from '@pinia-orm/axios';

export class uctoo_user extends Model {
  static override entity = 'uctoo_user'

  @Uid() declare id: string
  @Str('') declare email: string
  @Str('') declare name: string
  // ... 其他字段

  static override config = {
    axiosApi: {
      actions: {
        // 列表查询
        getUctooUserList(page: number, pageSize: number, searchParams?: any) {
          return useAxiosRepo(uctoo_user).api().get(
            `/api/v1/uctoo/uctoo_user/${pageSize}/${page}`, {
              params: searchParams,
              dataKey: 'uctoo_users'  // 分页数据键名
            }
          )
        },
        // 单条查询
        getUctooUser(id: string) {
          return useAxiosRepo(uctoo_user).api().get(`/api/v1/uctoo/uctoo_user/${id}`)
        },
        // 新增
        addUctooUser(data: any) {
          return useAxiosRepo(uctoo_user).api().post('/api/v1/uctoo/uctoo_user/add', data)
        },
        // 编辑
        editUctooUser(data: any) {
          return useAxiosRepo(uctoo_user).api().post('/api/v1/uctoo/uctoo_user/edit', data)
        },
        // 删除
        deleteUctooUser(data: any) {
          return useAxiosRepo(uctoo_user).api().post('/api/v1/uctoo/uctoo_user/del', data)
        },
        // 登录
        login(data: { email?: string; username?: string; password: string }) {
          return useAxiosRepo(uctoo_user).api().post('/api/v1/uctoo/uctoo_user/signin', data)
        }
      }
    }
  }
}
```

### 2. 同构状态管理使用示例

```vue
<script setup>
import { useAxiosRepo } from '@pinia-orm/axios'
import { uctoo_user } from '@/store/models/uctoo/uctoo_user'

// 获取用户列表
const fetchUsers = async () => {
  const res = await useAxiosRepo(uctoo_user).api().getUctooUserList(1, 10)
  // 数据自动存入 Pinia ORM store
  const users = useAxiosRepo(uctoo_user).all()
}

// 登录
const handleLogin = async (formData) => {
  const res = await useAxiosRepo(uctoo_user).api().login(formData)
  if (res.data.errno === '0') {
    // 登录成功
  }
}
</script>
```

### 3. AI 智能体集成

项目内置 AgentSkills Runtime JavaScript SDK，支持 AI 智能体功能：

- 自然语言数据库查询
- AI 辅助表单填写
- 智能数据分析

## 快速开始

### 方式一：一键安装（推荐）

Windows 用户可直接运行安装脚本：

```bash
# 克隆项目
git clone https://gitee.com/UCT/uctoo-app-client-pc.git
cd uctoo-app-client-pc

# 运行安装助手
start-installer.bat
```

安装助手会自动：
1. 检查 Node.js 环境
2. 安装前后端依赖
3. 启动后端服务（端口 3000）
4. 启动前端服务（端口 3031）
5. 打开浏览器进入安装向导

### 方式二：手动安装

#### 环境要求

- Node.js >= 14.0.0
- pnpm 或 npm

#### 安装步骤

1. **安装后端依赖**
```bash
cd nestJs
pnpm install --legacy-peer-deps
```

2. **安装前端依赖**
```bash
cd web
pnpm install --legacy-peer-deps
```

3. **配置环境变量**

复制 `.env.example` 为 `.env`，并根据实际情况修改：

```env
# 应用上下文
VITE_CONTEXT=/vue-pro/

# API 基础路径
VITE_BASE_API=/api

# 后端服务地址
VITE_SERVER_HOST=https://javatoarktsapi.uctoo.com
VITE_BACKEND_URL=https://javatoarktsapi.uctoo.com

# 构建输出目录
VITE_OUT_DIR=../dist
```

4. **启动后端服务**
```bash
cd nestJs
pnpm run start:dev
```

5. **启动前端服务**
```bash
cd web
pnpm run dev
```

6. **访问应用**

打开浏览器访问 http://localhost:3031

## 开发规范

### UMI 同构模型开发规范

1. **模型定义位置**：所有数据模型定义在 `src/store/models/uctoo/` 目录
2. **模型命名**：使用小写下划线命名，如 `uctoo_user`、`sys_config`
3. **API 方法命名**：采用 `动作+模型名` 格式，如 `getUctooUserList`、`addUctooUser`
4. **dataKey 配置**：
   - 分页接口：使用实体复数形式，如 `uctoo_users`、`uctoo_roles`
   - 非分页接口：使用 `data`
5. **Human-Code Preservation**：自定义代码写在 `//#region Human-Code Preservation` 区域内，避免被生成器覆盖

### 页面开发规范

1. **使用组合式 API**：`<script setup lang="ts">`
2. **状态管理**：优先使用 Pinia ORM 模型，而非传统 Pinia store
3. **API 调用**：通过模型层的 `useAxiosRepo(Model).api().方法名()` 方式调用
4. **类型定义**：所有数据类型使用 TypeScript 严格定义

## 构建部署

### 开发构建

```bash
cd web

# Vite 开发服务器
pnpm run dev

# 或指定端口
pnpm run start
```

### 生产构建

```bash
cd web

# Vite 生产构建
pnpm run build

# Webpack 构建
pnpm run build:wp

# Rspack 构建
pnpm run build:rp

# Farm 构建
pnpm run build:fr
```

### 构建输出

构建后的文件位于 `web/dist` 目录，可部署到任意静态服务器。

## 相关项目

- [agentskills-runtime](https://atomgit.com/UCToo/agentskills-runtime) - Agent Skills 运行时内核
- [uctoo-app-client-pc](https://gitee.com/UCT/uctoo-app-client-pc) - UCToo 应用开发管理后台

## 许可证

MIT License

Copyright (c) 2026 UCToo
