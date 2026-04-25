# Chat MCP 功能集成文档

## 概述

本实现基于 webmcp-sdk 架构,对接 agentskills-runtime 后端服务,提供完整的 AI 聊天和技能执行功能。

## 架构设计

```
web-admin/web/
├── src/
│   ├── views/chat/index.vue          # 聊天页面
│   ├── lib/webmcp-sdk/packages/
│   │   ├── next-sdk/
│   │   │   └── chat/
│   │   │       └── ChatMcpServer.ts  # Chat MCP Server 实现
│   │   └── next-remoter/
│   │       └── src/components/
│   │           └── ChatRemoter.vue   # Chat Remoter 组件
│   └── router/routes/modules/
│       └── uctoo.ts                  # 路由配置(已添加 chat 路由)
└── .env                              # 环境变量配置
```

## 核心组件

### 1. ChatMcpServer

**位置**: `src/lib/webmcp-sdk/packages/next-sdk/chat/ChatMcpServer.ts`

**功能**:
- 提供 `chat` 工具 - 与大模型对话
- 提供 `list_skills` 工具 - 列出可用技能
- 提供 `execute_skill` 工具 - 执行技能
- WebSocket 连接管理
- 心跳保活机制

**使用示例**:
```typescript
import { WebMcpServer } from '@opentiny/next-sdk'
import { createChatMcpServer } from './chat/ChatMcpServer'

const server = new WebMcpServer({
  name: 'chat-server',
  version: '1.0.0'
})

const chatMcp = createChatMcpServer(server, {
  wsUrl: 'wss://javatoarktsapi.uctoo.com/ws/chat',
  connectionTimeout: 10000,
  heartbeatInterval: 10000,
  heartbeatTimeout: 20000
})

// 获取会话 ID
const sessionId = chatMcp.getSessionId()

// 获取连接状态
const status = chatMcp.getConnectionStatus()

// 断开连接
chatMcp.disconnect()
```

### 2. ChatRemoter 组件

**位置**: `src/lib/webmcp-sdk/packages/next-remoter/src/components/ChatRemoter.vue`

**功能**:
- 基于 TinyRemoter 的聊天界面
- 自动连接 WebSocket
- 自定义欢迎界面和提示建议
- 会话管理和错误处理

**Props**:
- `show`: 是否显示对话框
- `title`: 标题
- `wsUrl`: WebSocket 地址
- `agentRoot`: Agent 服务根地址

**Events**:
- `session-created`: 会话创建成功
- `error`: 发生错误

**使用示例**:
```vue
<template>
  <ChatRemoter
    v-model:show="showChat"
    title="AI 助手"
    @session-created="handleSessionCreated"
    @error="handleError"
  />
</template>

<script setup>
import { ref } from 'vue'
import ChatRemoter from '@/lib/webmcp-sdk/packages/next-remoter/src/components/ChatRemoter.vue'

const showChat = ref(false)

function handleSessionCreated(sessionId) {
  console.log('Session created:', sessionId)
}

function handleError(error) {
  console.error('Error:', error)
}
</script>
```

### 3. Chat 页面

**位置**: `src/views/chat/index.vue`

**路由**: `/uctoo/chat`

**功能**:
- 展示 AI 助手功能介绍
- 连接状态显示
- 打开聊天对话框

## 配置说明

### 环境变量

在 `.env` 文件中添加以下配置:

```bash
# AI Chat 配置
VITE_WS_URL=wss://javatoarktsapi.uctoo.com/ws/chat
VITE_AGENT_ROOT=https://javatoarktsapi.uctoo.com
VITE_OPENAI_API_KEY=your-api-key
VITE_OPENAI_BASE_URL=https://api.openai.com/v1
VITE_OPENAI_MODEL=gpt-4o
```

### 路由配置

路由已自动添加到 `src/router/routes/modules/uctoo.ts`:

```typescript
{
  path: 'chat',
  name: 'uctoo-chat',
  component: () => import('@/views/chat/index.vue'),
  meta: {
    title: 'AI 助手',
    icon: 'icon-chat',
  },
}
```

## 与 agentskills-runtime 的对接

### WebSocket 消息协议

**连接**:
```json
// 客户端连接到 wss://javatoarktsapi.uctoo.com/ws/chat
// 服务端返回 welcome 消息
{
  "type": "welcome",
  "payload": {
    "session_id": "xxx-xxx-xxx"
  },
  "timestamp": 1234567890
}
```

**聊天**:
```json
// 客户端发送
{
  "type": "chat",
  "content": "你好",
  "message_id": "chat-123"
}

// 服务端返回
{
  "type": "chat_response",
  "payload": {
    "content": "你好!我是 AI 助手...",
    "message_id": "chat-123"
  },
  "timestamp": 1234567890
}
```

**列出技能**:
```json
// 客户端发送
{
  "type": "list_skills",
  "message_id": "list_skills"
}

// 服务端返回
{
  "type": "skills_list",
  "payload": {
    "skills": [
      {
        "id": "skill-1",
        "name": "数据分析",
        "description": "分析数据",
        "version": "1.0.0"
      }
    ]
  },
  "timestamp": 1234567890
}
```

**执行技能**:
```json
// 客户端发送
{
  "type": "execute_skill",
  "skill_id": "skill-1",
  "parameters": {},
  "timeout": "60s",
  "message_id": "skill-1"
}

// 服务端返回
{
  "type": "skill_result",
  "payload": {
    "skill_id": "skill-1",
    "success": "true",
    "output": "执行结果..."
  },
  "timestamp": 1234567890
}
```

**心跳**:
```json
// 客户端发送
{
  "type": "ping"
}

// 服务端返回
{
  "type": "pong",
  "timestamp": 1234567890
}
```

## 扩展开发

### 添加新的 MCP 工具

在 `ChatMcpServer.ts` 中添加新的工具注册:

```typescript
server.registerTool(
  'new_tool',
  {
    title: '新工具',
    description: '工具描述',
    inputSchema: {
      param1: z.string().describe('参数1')
    }
  },
  async ({ param1 }) => {
    // 实现工具逻辑
    return {
      content: [{
        type: 'text',
        text: '结果'
      }]
    }
  }
)
```

### 自定义 ChatRemoter

可以通过插槽自定义界面:

```vue
<ChatRemoter v-model:show="show">
  <template #welcome>
    <div>自定义欢迎界面</div>
  </template>

  <template #suggestions>
    <div>自定义提示建议</div>
  </template>
</ChatRemoter>
```

## 测试验证

### 1. 启动应用

```bash
cd D:\UCT\projects\miniapp\qintong\Delivery\uctoo-admin\apps\web-admin\web
npm start
```

### 2. 访问聊天页面

打开浏览器访问: `http://localhost:3031/uctoo/chat`

### 3. 测试功能

1. 点击"打开聊天"按钮
2. 检查 WebSocket 连接状态
3. 输入消息测试对话功能
4. 使用 `@` 符号唤起技能列表
5. 执行技能测试

## 常见问题

### 1. WebSocket 连接失败

**原因**: 后端服务未启动或地址配置错误

**解决**:
- 检查 agentskills-runtime 服务是否启动
- 验证 `.env` 中的 `VITE_WS_URL` 配置

### 2. 技能列表为空

**原因**: agentskills-runtime 中未安装技能

**解决**:
- 在 agentskills-runtime 的 `skills/` 目录安装技能
- 重启 agentskills-runtime 服务

### 3. 对话无响应

**原因**: LLM API 配置错误或额度不足

**解决**:
- 检查 `.env` 中的 `VITE_OPENAI_API_KEY`
- 验证 API 额度是否充足

## 后续优化

1. **持久化会话**: 将聊天记录保存到数据库
2. **多模型支持**: 支持切换不同的 LLM 模型
3. **技能市场**: 提供可视化的技能管理界面
4. **对话历史**: 支持查看和恢复历史对话
5. **流式响应**: 实现打字机效果的流式输出

## 相关文档

- [next-remoter README](../packages/next-remoter/README.md)
- [webmcp-sdk 文档](https://docs.opentiny.design/next-sdk/guide/)
- [agentskills-runtime 文档](../../agentskills-runtime/README.md)
