# WebMCP 标准与 SDK 使用指南

## 1. WebMCP 标准概述

WebMCP (Web Model Context Protocol) 是一个正在 W3C 孵化的新标准，旨在使 web 应用能够提供基于 JavaScript 的工具，这些工具可以被 AI 代理和辅助技术访问，以创建协作的、人在环中的工作流。

### 核心概念

- **工具 (Tools)**：JavaScript 函数，带有自然语言描述和结构化模式，可被 AI 代理调用
- **MCP (Model Context Protocol)**：WebMCP 基于的底层协议，用于应用与 AI 模型的接口
- **人在环 (Human-in-the-loop)**：用户与代理在同一 web 界面内协作的工作流

### 主要优势

1. **无需后端集成**：开发者可以直接在前端代码中定义工具，无需编写后端服务
2. **共享上下文**：用户和代理在同一界面中工作，保持共享的上下文和状态
3. **代码复用**：可以重用现有的前端业务逻辑
4. **简化认证**：利用现有的用户会话和认证状态
5. **提升可访问性**：为辅助技术提供标准化的方式访问 web 应用功能

## 2. webmcp-sdk 架构与使用

### 目录结构

```
webmcp-sdk/
├── packages/
│   ├── next-sdk/           # 核心 SDK
│   │   ├── webmcp/         # WebMCP 核心实现
│   │   ├── chat/           # 聊天功能实现
│   │   ├── remoter/        # 远程控制功能
│   │   └── WebMcpServer.ts # MCP 服务器实现
│   └── next-remoter/       # 远程控制组件
│       ├── src/            # 源代码
│       └── public/         # 静态资源
```

### 核心组件

#### WebMcpServer

`WebMcpServer` 是 SDK 的核心组件，负责注册和管理工具，处理工具调用请求。

```typescript
import { WebMcpServer } from '@opentiny/next-sdk'

// 创建 MCP 服务器
const server = new WebMcpServer()

// 注册工具
server.registerTool(
  'chat',
  {
    title: '与大模型对话',
    description: '向大模型发送消息并获取回复',
    inputSchema: {
      message: z.string().describe('要发送的消息内容')
    }
  },
  async ({ message }) => {
    // 实现逻辑
    return {
      content: [{
        type: 'text',
        text: '回复内容'
      }]
    }
  }
)
```

#### ChatMcpServer

`ChatMcpServer` 是专门用于聊天功能的 MCP 服务器实现，提供了与 agentskills-runtime 对接的能力。

```typescript
import { createChatMcpServer } from '@opentiny/next-sdk/chat'

// 创建聊天 MCP 服务器
const chatServer = createChatMcpServer(server, {
  wsUrl: 'ws://localhost:8080/ws/chat' // agentskills-runtime WebSocket 地址
})
```

#### TinyRemoter

`TinyRemoter` 是一个悬浮窗组件，提供了 AI 对话和远程控制功能的 UI 界面。

```typescript
import { TinyRemoter } from '@opentiny/next-remoter'

// 使用 TinyRemoter 组件
<TinyRemoter
  :sessionId="sessionId"
  :title="'AI 助手'"
  :llmConfig="llmConfig"
  :customMarketMcpServers="mcpServers"
/>
```

## 3. 配置与集成

### 环境变量

在 `.env` 文件中配置必要的环境变量：

```env
# WebSocket 地址（agentskills-runtime）
VITE_WS_URL=ws://localhost:8080/ws/chat

# Agent 服务地址（agentskills-runtime）
VITE_AGENT_ROOT=http://localhost:8080

# OpenAI API 配置（可选）
VITE_OPENAI_API_KEY=your_api_key
VITE_OPENAI_BASE_URL=https://api.openai.com/v1
VITE_OPENAI_MODEL=gpt-4o
```

### 集成步骤

1. **安装依赖**

```bash
npm install @opentiny/next-sdk @opentiny/next-remoter
```

2. **创建 MCP 服务器**

```typescript
// src/mcp-servers/index.ts
import { WebMcpServer } from '@opentiny/next-sdk'
import { createChatMcpServer } from '@opentiny/next-sdk/chat'

export function createMcpServer() {
  const server = new WebMcpServer()
  
  // 注册聊天相关工具
  createChatMcpServer(server, {
    wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws/chat'
  })
  
  return server
}
```

3. **在应用中使用**

```vue
<!-- src/App.vue -->
<template>
  <div>
    <router-view />
  </div>
  <TinyRemoter
    :sessionId="sessionId"
    :title="'UCTOO AI 助手'"
    :customMarketMcpServers="mcpServers"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { TinyRemoter } from '@opentiny/next-remoter'
import { createMcpServer } from './mcp-servers'

const sessionId = ref('')
const mcpServers = ref([{
  id: 'chat-mcp',
  name: '聊天服务',
  description: '对接 agentskills-runtime 的聊天和技能服务',
  url: 'http://localhost:8080/mcp/stream',
  type: 'sse',
  enabled: true,
  addState: 'added',
  tools: []
}])

onMounted(async () => {
  // 创建 MCP 服务器
  const server = createMcpServer()
  
  // 连接到 MCP 客户端
  const client = new WebMcpClient()
  await client.connect({
    agent: true,
    url: 'http://localhost:8080/mcp/stream'
  })
  
  // 获取会话 ID
  sessionId.value = client.sessionId
})
</script>
```

## 4. 与 agentskills-runtime 对接

### agentskills-runtime 服务地址

- **HTTP API 地址**：`http://localhost:8080`
- **WebSocket 地址**：`ws://localhost:8080/ws/chat`
- **MCP 流地址**：`http://localhost:8080/mcp/stream`

### 启动 agentskills-runtime

```bash
# 在 agentskills-runtime 目录下执行
cjpm run --skip-build --name magic.app
```

### 可用的 API 端点

- `GET /hello` - 健康检查
- `GET /skills` - 获取技能列表
- `GET /skills/:id` - 获取技能详情
- `POST /skills/add` - 添加技能
- `POST /skills/edit` - 编辑技能
- `POST /skills/del` - 删除技能
- `POST /skills/execute` - 执行技能
- `POST /skills/search` - 搜索技能
- `GET /mcp/stream` - MCP 服务器流式接口

## 5. 常见问题与故障排除

### WebSocket 连接失败

**检查清单**：
- agentskills-runtime 服务是否启动
- WebSocket 地址是否正确（`ws://localhost:8080/ws/chat`）
- 网络连接是否正常
- 防火墙是否阻止连接

### 工具调用失败

**检查清单**：
- MCP 服务器是否正确注册
- 工具参数是否符合 schema
- WebSocket 连接状态是否正常
- agentskills-runtime 服务是否正常运行

### 技能不显示

**检查清单**：
- agentskills-runtime 中是否安装了技能
- `list_skills` 工具调用是否成功
- WebSocket 连接是否正常

## 6. 最佳实践

### 工具设计

1. **清晰的描述**：为每个工具提供详细的自然语言描述
2. **明确的参数**：使用结构化的输入模式定义参数
3. **合理的返回值**：返回结构化的结果，便于 AI 理解
4. **错误处理**：适当处理错误并返回有意义的错误信息

### 性能优化

1. **连接管理**：合理管理 WebSocket 连接，避免频繁重连
2. **心跳机制**：实现心跳保活，确保连接稳定
3. **消息队列**：使用消息队列管理异步请求
4. **缓存策略**：对频繁使用的数据进行缓存

### 安全考虑

1. **输入验证**：验证所有工具输入参数
2. **权限控制**：确保工具调用符合用户权限
3. **敏感信息**：避免在工具参数或返回值中包含敏感信息
4. **错误处理**：不向客户端暴露内部错误详情

## 7. 示例代码

### 基本聊天功能

```typescript
// 创建聊天 MCP 服务器
const chatServer = createChatMcpServer(server, {
  wsUrl: 'ws://localhost:8080/ws/chat'
})

// 发送聊天消息
async function sendChatMessage(message: string) {
  const response = await server.callTool('chat', {
    message
  })
  return response.content[0].text
}

// 列出可用技能
async function listSkills() {
  const response = await server.callTool('list_skills', {})
  return JSON.parse(response.content[0].text)
}

// 执行技能
async function executeSkill(skillId: string, parameters: any) {
  const response = await server.callTool('execute_skill', {
    skill_id: skillId,
    parameters
  })
  return response.content[0].text
}
```

### 高级配置

```typescript
// 配置 LLM
const llmConfig = {
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  baseURL: import.meta.env.VITE_OPENAI_BASE_URL || 'https://api.openai.com/v1',
  providerType: 'openai' as const,
  model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o',
  maxSteps: 10
}

// 配置 MCP 服务器
const mcpServers = [
  {
    id: 'chat-mcp',
    name: '聊天服务',
    description: '对接 agentskills-runtime 的聊天和技能服务',
    url: 'http://localhost:8080/mcp/stream',
    type: 'sse',
    enabled: true,
    addState: 'added',
    tools: []
  }
]
```

## 8. 总结

WebMCP 标准为 web 应用与 AI 代理的交互提供了一种标准化的方式，使开发者能够轻松地将应用功能暴露为可被 AI 调用的工具。通过使用 webmcp-sdk，开发者可以快速集成这一功能，实现与 agentskills-runtime 的对接，为用户提供智能、高效的交互体验。

### 关键要点

- WebMCP 允许 web 应用在前端定义可被 AI 代理调用的工具
- webmcp-sdk 提供了完整的实现，包括 MCP 服务器、聊天功能和 UI 组件
- 与 agentskills-runtime 对接需要正确配置 WebSocket 地址和 API 地址
- 合理的工具设计和性能优化是确保良好用户体验的关键

通过遵循本指南，开发者可以正确理解和使用 WebMCP 标准，为应用添加智能交互能力，提升用户体验。