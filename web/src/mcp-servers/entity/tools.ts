/**
 * Entity Tools - Entity模块的WebMCP工具定义
 * 用于agent通过自然语言操作entity页面的CRUD功能
 */

import type { PageAwareServer } from '@opentiny/next-sdk'
import { z } from '@opentiny/next-sdk'

/**
 * 注册 Entity 工具
 */
function registerEntityTools(server: PageAwareServer) {
  // query-entity-list 工具 - 查询entity列表
  server.registerTool(
    'query-entity-list',
    {
      title: '查询Entity列表',
      description: '查询entity数据列表，支持分页、筛选和排序',
      inputSchema: {
        page: z.number().optional().describe('页码，从1开始').default(1),
        pageSize: z.number().optional().describe('每页数量').default(10),
        link: z.string().optional().describe('按link字段筛选'),
        status: z.string().optional().describe('按status字段筛选'),
        owner: z.string().optional().describe('按owner字段筛选'),
        city: z.string().optional().describe('按city字段筛选'),
        sortBy: z.string().optional().describe('排序字段'),
        sortOrder: z.enum(['asc', 'desc']).optional().describe('排序方向').default('asc'),
      },
    },
    { route: '/database/uctoo/entity' },
  )

  // create-entity 工具 - 创建entity
  server.registerTool(
    'create-entity',
    {
      title: '创建Entity',
      description: '创建新的entity记录',
      inputSchema: {
        link: z.string().describe('链接地址'),
        description: z.string().optional().describe('描述'),
        privacy_level: z.string().optional().describe('隐私级别').default('public'),
        stars: z.number().optional().describe('星标数').default(0),
        price: z.number().optional().describe('价格').default(0),
        owner: z.string().optional().describe('所有者'),
        status: z.string().optional().describe('状态').default('active'),
        city: z.string().optional().describe('城市'),
      },
    },
    { route: '/database/uctoo/entity/add' },
  )

  // edit-entity 工具 - 编辑entity
  server.registerTool(
    'edit-entity',
    {
      title: '编辑Entity',
      description: '编辑指定的entity记录',
      inputSchema: {
        id: z.string().describe('Entity ID'),
        link: z.string().optional().describe('链接地址'),
        description: z.string().optional().describe('描述'),
        privacy_level: z.string().optional().describe('隐私级别'),
        stars: z.number().optional().describe('星标数'),
        price: z.number().optional().describe('价格'),
        owner: z.string().optional().describe('所有者'),
        status: z.string().optional().describe('状态'),
        city: z.string().optional().describe('城市'),
      },
    },
    { route: '/database/uctoo/entity' },
  )

  // delete-entity 工具 - 删除entity
  server.registerTool(
    'delete-entity',
    {
      title: '删除Entity',
      description: '删除指定的entity记录，支持软删除和硬删除',
      inputSchema: {
        id: z.string().optional().describe('Entity ID（单个删除）'),
        ids: z.array(z.string()).optional().describe('Entity ID数组（批量删除）'),
        force: z.boolean().optional().describe('是否硬删除（true则永久删除，false则软删除）').default(false),
      },
    },
    { route: '/database/uctoo/entity' },
  )

  // restore-entity 工具 - 恢复entity
  server.registerTool(
    'restore-entity',
    {
      title: '恢复Entity',
      description: '从回收站恢复已删除的entity记录',
      inputSchema: {
        id: z.string().describe('Entity ID'),
      },
    },
    { route: '/database/uctoo/entity' },
  )
}

export default registerEntityTools
