# Mock API 配置修复说明

## 问题描述
访问 install.html 页面时，控制台报错：
```
[vite] http proxy error: /api/setup/check-environment
Error: connect ECONNREFUSED 127.0.0.1:3000
```

## 问题原因
Vite 配置将所有 `/api/*` 请求代理到 `http://127.0.0.1:3000`，但该端口没有服务运行。
我们需要让 vite-plugin-mock 插件处理 `/api/setup/*` 路径的请求。

## 解决方案

### 1. 添加 vite-plugin-mock 插件
在 `config/vite.config.base.ts` 中添加：

```typescript
import { viteMockServe } from 'vite-plugin-mock'

const config = {
  plugins: [
    // ... 其他插件
    viteMockServe({
      mockPath: 'src/mock',
      localEnabled: true,
      prodEnabled: false,
      watchFiles: true,
      logger: true,
    }),
  ],
  // ...
}
```

### 2. 修改代理配置
在 `config/vite.config.dev.ts` 中修改代理配置，排除 `/api/setup/*` 路径：

```typescript
const proxyConfig = {
  [env.VITE_BASE_API]: {
    target: env.VITE_SERVER_HOST,
    changeOrigin: true,
    logLevel: 'debug',
    // 排除 /api/setup/* 路径
    bypass: (req: any) => {
      if (req.url && req.url.startsWith('/api/setup')) {
        return req.url
      }
      return null
    },
  },
  // ...
}
```

## 测试步骤

### 1. 重启开发服务器
```bash
cd D:\UCT\projects\miniapp\qintong\Delivery\uctoo-admin\apps\web-admin\uctoo-admin\web
npm start
```

### 2. 访问安装页面
打开浏览器访问：
```
http://localhost:3031/install.html
```

### 3. 检查控制台
- 不应该再出现 `ECONNREFUSED` 错误
- 应该能看到 Mock API 的响应数据

### 4. 测试 API
在浏览器控制台执行：
```javascript
fetch('/api/setup/check-environment')
  .then(r => r.json())
  .then(data => console.log(data))
```

应该返回：
```json
{
  "code": 200,
  "data": [
    {
      "name": "nodejs",
      "label": "Node.js",
      "passed": true,
      "current": "v18.17.0",
      "required": ">= 18.0.0"
    },
    // ...
  ],
  "message": "环境检测完成"
}
```

## Mock API 端点列表

所有 Mock API 都定义在 `src/mock/setup.ts` 中：

1. `/api/setup/check-environment` - 环境检测
2. `/api/setup/save-config` - 配置保存
3. `/api/setup/load-config` - 配置加载
4. `/api/setup/test-config` - 配置测试
5. `/api/setup/service-status` - 服务状态
6. `/api/setup/logs` - 日志获取
7. `/api/setup/create-admin` - 管理员账号创建
8. `/api/setup/start-runtime` - 启动服务
9. `/api/setup/stop-runtime` - 停止服务
10. `/api/setup/restart-runtime` - 重启服务

## 注意事项

1. **开发环境**：Mock API 仅在开发环境启用（`localEnabled: true`）
2. **生产环境**：Mock API 在生产环境禁用（`prodEnabled: false`）
3. **热更新**：修改 Mock API 文件后，Vite 会自动重新加载（`watchFiles: true`）
4. **日志**：Mock API 请求会在控制台显示日志（`logger: true`）

## 如果问题仍然存在

1. **清除缓存**：删除 `node_modules/.vite` 目录
2. **重新安装依赖**：`npm install`
3. **检查端口**：确保 3031 端口没有被占用
4. **检查 Mock 文件**：确保 `src/mock/setup.ts` 文件存在且格式正确

## 验证成功标志

- ✅ 控制台没有 `ECONNREFUSED` 错误
- ✅ 环境检测步骤显示检测结果
- ✅ 可以在控制台看到 Mock API 的日志
- ✅ 所有 API 请求返回正确的 Mock 数据
