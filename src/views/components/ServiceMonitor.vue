<template>
  <div class="service-monitor">
    <h3>服务监控</h3>
    
    <div class="services">
      <div v-for="service in services" :key="service.name" class="service-item">
        <div class="service-header">
          <span class="service-name">{{ service.name }}</span>
          <TinyTag :type="service.status === 'running' ? 'success' : 'danger'">
            {{ service.status }}
          </TinyTag>
        </div>
        <div class="service-metrics">
          <p>CPU: {{ service.cpu }}%</p>
          <p>内存: {{ service.memory }}MB</p>
          <p>运行时间: {{ service.uptime || '-' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Tag as TinyTag } from '@opentiny/vue';

interface Service {
  name: string;
  status: string;
  cpu: number;
  memory: number;
  uptime: string;
}

const services = ref<Service[]>([
  { name: 'agentskills-runtime', status: 'stopped', cpu: 0, memory: 0, uptime: '' },
  { name: 'PostgreSQL', status: 'stopped', cpu: 0, memory: 0, uptime: '' },
  { name: 'Redis', status: 'stopped', cpu: 0, memory: 0, uptime: '' }
]);

let updateInterval: any = null;

async function updateServiceStatus() {
  try {
    const response = await fetch('/api/setup/service-status');
    const result = await response.json();
    if (result.code === 200) {
      services.value = result.data;
    }
  } catch (error) {
    console.error('获取服务状态失败:', error);
  }
}

onMounted(() => {
  updateServiceStatus();
  // 每 3 秒更新一次
  updateInterval = setInterval(updateServiceStatus, 3000);
});

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
});
</script>

<style scoped>
.service-monitor {
  padding: 20px;
}

.service-monitor h3 {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
}

.services {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.service-item {
  padding: 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  transition: all 0.3s;
}

.service-item:hover {
  border-color: #1890ff;
}

.service-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.service-name {
  font-weight: 600;
  font-size: 16px;
}

.service-metrics {
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.service-metrics p {
  margin: 5px 0;
  font-size: 13px;
  color: #666;
}
</style>
