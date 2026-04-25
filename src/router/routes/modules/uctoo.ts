import type { RouteRecordRaw } from 'vue-router'

const uctooRoutes: RouteRecordRaw[] = [
  {
    path: '/uctoo',
    name: 'uctoo',
    component: () => import('@/layout/index.vue'),
    meta: {
      title: 'uctoo',
      icon: 'icon-home',
    },
    children: [
      {
        path: 'entity',
        name: 'uctoo-entity',
        component: () => import('@/views/uctoo/entity/index.vue'),
        meta: {
          title: 'entity',
          icon: 'icon-table',
        },
      },
      {
        path: 'chat',
        name: 'uctoo-chat',
        component: () => import('@/views/chat/index.vue'),
        meta: {
          title: 'AI 助手',
          icon: 'icon-chat',
        },
      },
    ],
  },
]

export default uctooRoutes
