# UCToo Web Admin

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-4.0.0-blue.svg)]()
[![Vue](https://img.shields.io/badge/vue-3.5+-green.svg)](https://vuejs.org/)

## Introduction

UCToo Web Admin is the PC frontend project for UCToo v4 management backend, built with Vue 3 + TypeScript + OpenTiny Vue. It adopts the UMI (Unified Model Interface) full-stack isomorphic architecture, achieving isomorphism in data models, state management, and API calls between frontend and backend.

## Architecture

### UMI Full-Stack Isomorphic Architecture

This project follows the UMI (Unified Model Interface) full-stack isomorphic architecture design principles:

- **Data Model Isomorphism**: Frontend uses Pinia ORM to define data models completely consistent with the backend
- **State Management Isomorphism**: Implements frontend caching and synchronization of server-side state through Pinia ORM
- **API Call Isomorphism**: Model layer directly integrates API call methods, achieving integration of data fetching and state management

### Technology Stack

- **Frontend Framework**: Vue 3.5+ + TypeScript
- **UI Component Library**: OpenTiny Vue 3.28+
- **State Management**: Pinia 2.1.7 + Pinia ORM 1.10.2
- **HTTP Client**: Axios 1.7.9
- **Build Tools**: Vite / Webpack / Rspack / Farm (multi-build-tool support)
- **Routing**: Vue Router 4.4.5
- **Internationalization**: Vue I18n 11.0.0
- **AI Integration**: @opencangjie/skills SDK + WebMCP SDK

> **Note:** The nestJs backend service is only used for the start-installer.bat quick installation process. The actual server-side APIs that support web business are all provided by agentskills-runtime.

## Project Structure

```
web-admin/
├── nestJs/                 # NestJS backend service
│   ├── src/               # Backend source code
│   ├── package.json       # Backend dependencies
│   └── ...
├── web/                   # Vue frontend project
│   ├── src/
│   │   ├── api/          # API interface definitions (traditional way, gradually migrating to models)
│   │   ├── assets/       # Static resources
│   │   ├── components/   # Common components
│   │   ├── hooks/        # Composable functions
│   │   ├── layout/       # Layout components
│   │   ├── locale/       # Internationalization configuration
│   │   ├── router/       # Router configuration
│   │   ├── store/        # State management
│   │   │   ├── models/   # ORM data models (UMI isomorphism core)
│   │   │   │   └── uctoo/
│   │   │   │       ├── uctoo_user.ts      # User model + API methods
│   │   │   │       ├── uctoo_role.ts      # Role model + API methods
│   │   │   │       ├── permissions.ts     # Permission model + API methods
│   │   │   │       └── ...
│   │   │   └── modules/  # Pinia state modules
│   │   ├── utils/        # Utility functions
│   │   └── views/        # Page views
│   ├── config/           # Build configuration
│   ├── public/           # Public resources
│   └── package.json      # Frontend dependencies
└── start-installer.bat   # One-click installation and startup script
```

## Core Features

### 1. UMI Full-Stack Model Isomorphism

Data models are defined in the `src/store/models/uctoo/` directory, where each model simultaneously defines data structure and API call methods:

```typescript
// src/store/models/uctoo/uctoo_user.ts
import { Model } from 'pinia-orm';
import { useAxiosRepo } from '@pinia-orm/axios';

export class uctoo_user extends Model {
  static override entity = 'uctoo_user'

  @Uid() declare id: string
  @Str('') declare email: string
  @Str('') declare name: string
  // ... other fields

  static override config = {
    axiosApi: {
      actions: {
        // List query
        getUctooUserList(page: number, pageSize: number, searchParams?: any) {
          return useAxiosRepo(uctoo_user).api().get(
            `/api/v1/uctoo/uctoo_user/${pageSize}/${page}`, {
              params: searchParams,
              dataKey: 'uctoo_users'  // Pagination data key
            }
          )
        },
        // Single query
        getUctooUser(id: string) {
          return useAxiosRepo(uctoo_user).api().get(`/api/v1/uctoo/uctoo_user/${id}`)
        },
        // Create
        addUctooUser(data: any) {
          return useAxiosRepo(uctoo_user).api().post('/api/v1/uctoo/uctoo_user/add', data)
        },
        // Update
        editUctooUser(data: any) {
          return useAxiosRepo(uctoo_user).api().post('/api/v1/uctoo/uctoo_user/edit', data)
        },
        // Delete
        deleteUctooUser(data: any) {
          return useAxiosRepo(uctoo_user).api().post('/api/v1/uctoo/uctoo_user/del', data)
        },
        // Login
        login(data: { email?: string; username?: string; password: string }) {
          return useAxiosRepo(uctoo_user).api().post('/api/v1/uctoo/uctoo_user/signin', data)
        }
      }
    }
  }
}
```

### 2. Isomorphic State Management Usage Example

```vue
<script setup>
import { useAxiosRepo } from '@pinia-orm/axios'
import { uctoo_user } from '@/store/models/uctoo/uctoo_user'

// Get user list
const fetchUsers = async () => {
  const res = await useAxiosRepo(uctoo_user).api().getUctooUserList(1, 10)
  // Data automatically stored in Pinia ORM store
  const users = useAxiosRepo(uctoo_user).all()
}

// Login
const handleLogin = async (formData) => {
  const res = await useAxiosRepo(uctoo_user).api().login(formData)
  if (res.data.errno === '0') {
    // Login successful
  }
}
</script>
```

### 3. AI Agent Integration

The project includes AgentSkills Runtime JavaScript SDK, supporting AI agent features:

- Natural language database queries
- AI-assisted form filling
- Intelligent data analysis

## Quick Start

### Method 1: One-Click Installation (Recommended)

Windows users can directly run the installation script:

```bash
# Clone project
git clone https://gitee.com/UCT/uctoo-app-client-pc.git
cd uctoo-app-client-pc

# Run installation assistant
start-installer.bat
```

The installation assistant will automatically:
1. Check Node.js environment
2. Install frontend and backend dependencies
3. Start backend service (port 3000)
4. Start frontend service (port 3031)
5. Open browser to enter installation wizard

### Method 2: Manual Installation

#### Requirements

- Node.js >= 14.0.0
- pnpm or npm

#### Installation Steps

1. **Install backend dependencies**
```bash
cd nestJs
pnpm install --legacy-peer-deps
```

2. **Install frontend dependencies**
```bash
cd web
pnpm install --legacy-peer-deps
```

3. **Configure environment variables**

Copy `.env.example` to `.env` and modify according to your actual situation:

```env
# Application context
VITE_CONTEXT=/vue-pro/

# API base path
VITE_BASE_API=/api

# Backend service address
VITE_SERVER_HOST=https://javatoarktsapi.uctoo.com
VITE_BACKEND_URL=https://javatoarktsapi.uctoo.com

# Build output directory
VITE_OUT_DIR=../dist
```

4. **Start backend service**
```bash
cd nestJs
pnpm run start:dev
```

5. **Start frontend service**
```bash
cd web
pnpm run dev
```

6. **Access application**

Open browser and visit http://localhost:3031

## Development Guidelines

### UMI Isomorphic Model Development Guidelines

1. **Model Definition Location**: All data models are defined in `src/store/models/uctoo/` directory
2. **Model Naming**: Use lowercase underscore naming, e.g., `uctoo_user`, `sys_config`
3. **API Method Naming**: Use `action+modelName` format, e.g., `getUctooUserList`, `addUctooUser`
4. **dataKey Configuration**:
   - Pagination interfaces: Use entity plural form, e.g., `uctoo_users`, `uctoo_roles`
   - Non-pagination interfaces: Use `data`
5. **Human-Code Preservation**: Custom code should be written in `//#region Human-Code Preservation` area to avoid being overwritten by generators

### Page Development Guidelines

1. **Use Composition API**: `<script setup lang="ts">`
2. **State Management**: Prioritize using Pinia ORM models instead of traditional Pinia stores
3. **API Calls**: Call through model layer `useAxiosRepo(Model).api().methodName()`
4. **Type Definitions**: All data types use strict TypeScript definitions

## Build & Deployment

### Development Build

```bash
cd web

# Vite dev server
pnpm run dev

# Or specify port
pnpm run start
```

### Production Build

```bash
cd web

# Vite production build
pnpm run build

# Webpack build
pnpm run build:wp

# Rspack build
pnpm run build:rp

# Farm build
pnpm run build:fr
```

### Build Output

Built files are located in `web/dist` directory and can be deployed to any static server.

## Related Projects

- [agentskills-runtime](https://atomgit.com/UCToo/agentskills-runtime) - Agent Skills runtime kernel
- [uctoo-app-client-pc](https://gitee.com/UCT/uctoo-app-client-pc) - UCToo application development management backend

## License

MIT License

Copyright (c) 2026 UCToo
