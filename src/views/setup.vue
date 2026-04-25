<template>
  <div class="setup-container">
    <!-- 顶部状态栏 -->
    <header class="status-bar">
      <div class="runtime-status">
        <span :class="['status-indicator', runtimeStatus]"></span>
        <span class="status-text">{{ runtimeStatusText }}</span>
      </div>
      <div class="actions">
        <TinyButton type="primary" @click="restartRuntime" :disabled="runtimeStatus === 'stopped'">
          重启服务
        </TinyButton>
        <TinyButton @click="stopRuntime" :disabled="runtimeStatus === 'stopped'">
          停止服务
        </TinyButton>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="setup-content">
      <TinyTabs v-model="activeTab">
        <!-- 环境检测 -->
        <TinyTabPane label="环境检测" name="environment">
          <EnvironmentCheck />
        </TinyTabPane>

        <!-- 配置管理 -->
        <TinyTabPane label="配置管理" name="config">
          <ConfigManagement />
        </TinyTabPane>

        <!-- 服务监控 -->
        <TinyTabPane label="服务监控" name="monitor">
          <ServiceMonitor />
        </TinyTabPane>

        <!-- 日志查看 -->
        <TinyTabPane label="日志查看" name="logs">
          <LogViewer />
        </TinyTabPane>
      </TinyTabs>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { Button as TinyButton, Tabs as TinyTabs, TabItem as TinyTabPane } from '@opentiny/vue';
import EnvironmentCheck from './components/EnvironmentCheck.vue';
import ConfigManagement from './components/ConfigManagement.vue';
import ServiceMonitor from './components/ServiceMonitor.vue';
import LogViewer from './components/LogViewer.vue';

const activeTab = ref('environment');
const runtimeStatus = ref('stopped');
let statusCheckInterval: any = null;

// 计算属性：状态文本
const runtimeStatusText = computed(() => {
  const statusMap = {
    running: '运行中',
    stopped: '已停止',
    error: '错误'
  };
  return statusMap[runtimeStatus.value] || '未知';
});

// 检测 runtime 状态
async function checkRuntimeStatus() {
  try {
    const response = await fetch('/api/v1/uctoo/health');
    runtimeStatus.value = response.ok ? 'running' : 'error';
  } catch (error) {
    runtimeStatus.value = 'stopped';
  }
}

// 重启服务
async function restartRuntime() {
  try {
    const response = await fetch('/api/setup/restart-runtime', {
      method: 'POST'
    });
    const result = await response.json();
    if (result.code === 200) {
      alert('服务重启成功！');
      await checkRuntimeStatus();
    } else {
      alert('服务重启失败：' + result.message);
    }
  } catch (error) {
    alert('服务重启失败：' + error.message);
  }
}

// 停止服务
async function stopRuntime() {
  try {
    const response = await fetch('/api/setup/stop-runtime', {
      method: 'POST'
    });
    const result = await response.json();
    if (result.code === 200) {
      alert('服务停止成功！');
      runtimeStatus.value = 'stopped';
    } else {
      alert('服务停止失败：' + result.message);
    }
  } catch (error) {
    alert('服务停止失败：' + error.message);
  }
}

// 组件挂载
onMounted(async () => {
  await checkRuntimeStatus();
  // 每 5 秒检测一次状态
  statusCheckInterval = setInterval(checkRuntimeStatus, 5000);
});

// 组件卸载
onUnmounted(() => {
  if (statusCheckInterval) {
    clearInterval(statusCheckInterval);
  }
});
</script>

<style scoped>
.setup-container {
  padding: 20px;
  background: #fff;
  min-height: 100vh;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 20px;
}

.runtime-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.status-indicator.running {
  background: #52c41a;
  box-shadow: 0 0 0 2px rgba(82, 196, 26, 0.2);
}

.status-indicator.stopped {
  background: #d9d9d9;
}

.status-indicator.error {
  background: #f5222d;
  box-shadow: 0 0 0 2px rgba(245, 34, 45, 0.2);
}

.status-text {
  font-weight: 600;
  color: #333;
}

.actions {
  display: flex;
  gap: 10px;
}

.setup-content {
  background: #fff;
  border-radius: 4px;
}
</style>
