<template>
  <div class="log-viewer">
    <h3>日志查看</h3>
    
    <div class="log-controls">
      <TinySelect v-model="logType" placeholder="选择日志级别" style="width: 200px">
        <TinyOption label="全部" value="all" />
        <TinyOption label="错误" value="error" />
        <TinyOption label="警告" value="warn" />
        <TinyOption label="信息" value="info" />
      </TinySelect>
      <TinyButton @click="clearLogs" style="margin-left: 10px">清空日志</TinyButton>
      <TinyButton @click="loadLogs" style="margin-left: 10px">刷新日志</TinyButton>
    </div>
    
    <div class="log-content">
      <div v-for="log in filteredLogs" :key="log.id" :class="['log-item', log.level]">
        <span class="log-time">{{ log.time }}</span>
        <span class="log-level">[{{ log.level.toUpperCase() }}]</span>
        <span class="log-message">{{ log.message }}</span>
      </div>
      <div v-if="filteredLogs.length === 0" class="no-logs">
        暂无日志
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Select as TinySelect, Option as TinyOption, Button as TinyButton } from '@opentiny/vue';

interface LogItem {
  id: number;
  time: string;
  level: string;
  message: string;
}

const logs = ref<LogItem[]>([]);
const logType = ref('all');

const filteredLogs = computed(() => {
  if (logType.value === 'all') return logs.value;
  return logs.value.filter(log => log.level === logType.value);
});

async function loadLogs() {
  try {
    const response = await fetch('/api/setup/logs');
    const result = await response.json();
    if (result.code === 200) {
      logs.value = result.data;
    }
  } catch (error) {
    console.error('加载日志失败:', error);
  }
}

function clearLogs() {
  logs.value = [];
}

onMounted(() => {
  loadLogs();
});
</script>

<style scoped>
.log-viewer {
  padding: 20px;
}

.log-viewer h3 {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
}

.log-controls {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.log-content {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 16px;
  border-radius: 4px;
  max-height: 500px;
  overflow-y: auto;
  font-family: 'Courier New', Courier, monospace;
  font-size: 13px;
  line-height: 1.6;
}

.log-item {
  margin: 8px 0;
  padding: 4px 0;
  border-bottom: 1px solid #333;
}

.log-item:last-child {
  border-bottom: none;
}

.log-time {
  color: #888;
  margin-right: 10px;
}

.log-level {
  font-weight: 600;
  margin-right: 10px;
}

.log-item.error .log-level {
  color: #f5222d;
}

.log-item.warn .log-level {
  color: #faad14;
}

.log-item.info .log-level {
  color: #1890ff;
}

.log-message {
  color: #d4d4d4;
}

.no-logs {
  text-align: center;
  color: #888;
  padding: 20px;
}
</style>
