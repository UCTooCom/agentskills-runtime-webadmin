<template>
  <div class="ai-page">
    <div class="ai-header">
      <h1>AI 中心</h1>
    </div>
    <div class="ai-content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
// AI 中心容器组件
</script>

<style scoped>
.ai-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px;
  background: #f5f5f5;
}

.ai-header {
  margin-bottom: 24px;
  padding: 20px 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.ai-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #262626;
}

.ai-content {
  flex: 1;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
</style>