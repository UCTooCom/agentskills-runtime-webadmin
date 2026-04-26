<template>
  <div class="environment-check">
    <h3>系统环境检测</h3>
    
    <div class="check-items">
      <div v-for="check in checks" :key="check.name" class="check-item">
        <div class="check-header">
          <span class="check-name">{{ check.label }}</span>
          <TinyTag :type="check.passed ? 'success' : 'danger'">
            {{ check.passed ? '通过' : '未通过' }}
          </TinyTag>
        </div>
        <div class="check-detail">
          <p>当前版本: {{ check.current || '未检测到' }}</p>
          <p>要求版本: {{ check.required }}</p>
        </div>
      </div>
    </div>

    <TinyButton @click="runChecks" type="primary">重新检测</TinyButton>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Button as TinyButton, Tag as TinyTag } from '@opentiny/vue';

interface CheckItem {
  name: string;
  label: string;
  passed: boolean;
  current: string;
  required: string;
}

const checks = ref<CheckItem[]>([
  { name: 'nodejs', label: 'Node.js', passed: false, current: '', required: '>= 18.0.0' },
  { name: 'postgresql', label: 'PostgreSQL', passed: false, current: '', required: '>= 14.0' },
  { name: 'redis', label: 'Redis', passed: false, current: '', required: '>= 6.0' }
]);

async function runChecks() {
  try {
    const response = await fetch('/api/setup/check-environment');
    const result = await response.json();
    if (result.code === 200) {
      checks.value = result.data;
    }
  } catch (error) {
    console.error('环境检测失败:', error);
  }
}

onMounted(() => {
  runChecks();
});
</script>

<style scoped>
.environment-check {
  padding: 20px;
}

.environment-check h3 {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
}

.check-items {
  margin-bottom: 30px;
}

.check-item {
  padding: 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  margin-bottom: 12px;
  transition: all 0.3s;
}

.check-item:hover {
  border-color: #1890ff;
}

.check-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.check-name {
  font-weight: 600;
  font-size: 16px;
}

.check-detail {
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.check-detail p {
  margin: 5px 0;
  font-size: 13px;
  color: #666;
}
</style>
