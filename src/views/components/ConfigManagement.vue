<template>
  <div class="config-management">
    <h3>配置管理</h3>
    
    <TinyForm :model="config" label-width="120px">
      <!-- 数据库配置 -->
      <TinyFormItem label="数据库主机">
        <TinyInput v-model="config.dbHost" placeholder="localhost" />
      </TinyFormItem>
      
      <TinyFormItem label="数据库端口">
        <TinyInput v-model="config.dbPort" placeholder="5432" />
      </TinyFormItem>
      
      <TinyFormItem label="数据库名称">
        <TinyInput v-model="config.dbName" placeholder="uctoo" />
      </TinyFormItem>
      
      <TinyFormItem label="数据库用户">
        <TinyInput v-model="config.dbUser" placeholder="postgres" />
      </TinyFormItem>
      
      <TinyFormItem label="数据库密码">
        <TinyInput v-model="config.dbPassword" type="password" placeholder="输入密码" />
      </TinyFormItem>
      
      <!-- API 密钥配置 -->
      <TinyFormItem label="StepFun API Key">
        <TinyInput v-model="config.stepfunApiKey" type="password" placeholder="输入 StepFun API Key" />
      </TinyFormItem>
      
      <TinyFormItem label="SophNet API Key">
        <TinyInput v-model="config.sophnetApiKey" type="password" placeholder="输入 SophNet API Key" />
      </TinyFormItem>
      
      <TinyFormItem>
        <TinyButton type="primary" @click="saveConfig">保存配置</TinyButton>
        <TinyButton @click="testConfig" style="margin-left: 10px">测试配置</TinyButton>
      </TinyFormItem>
    </TinyForm>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Form as TinyForm, FormItem as TinyFormItem, Input as TinyInput, Button as TinyButton } from '@opentiny/vue';

const config = ref({
  dbHost: 'localhost',
  dbPort: '5432',
  dbName: 'uctoo',
  dbUser: 'postgres',
  dbPassword: '',
  stepfunApiKey: '',
  sophnetApiKey: ''
});

async function loadConfig() {
  try {
    const response = await fetch('/api/setup/load-config');
    const result = await response.json();
    if (result.code === 200 && result.data) {
      config.value = { ...config.value, ...result.data };
    }
  } catch (error) {
    console.error('加载配置失败:', error);
  }
}

async function saveConfig() {
  try {
    const response = await fetch('/api/setup/save-config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(config.value)
    });
    const result = await response.json();
    if (result.code === 200) {
      alert('配置保存成功！');
    } else {
      alert('配置保存失败：' + result.message);
    }
  } catch (error) {
    alert('配置保存失败：' + error.message);
  }
}

async function testConfig() {
  try {
    const response = await fetch('/api/setup/test-config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(config.value)
    });
    const result = await response.json();
    if (result.code === 200) {
      alert('配置测试通过！');
    } else {
      alert('配置测试失败：' + result.message);
    }
  } catch (error) {
    alert('配置测试失败：' + error.message);
  }
}

onMounted(() => {
  loadConfig();
});
</script>

<style scoped>
.config-management {
  padding: 20px;
}

.config-management h3 {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
}
</style>
