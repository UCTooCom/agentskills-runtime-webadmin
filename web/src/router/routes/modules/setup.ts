export default {
  path: '/setup',
  name: 'Setup',
  component: () => import('@/views/setup.vue'),
  meta: {
    title: '安装配置',
    icon: 'setting',
    requiresAuth: false // 安装阶段不需要认证
  }
};
