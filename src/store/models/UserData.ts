import { Model } from 'pinia-orm';
import { Attr, Str, Uid, Num, Bool, HasOne, HasMany, BelongsTo, HasManyBy, BelongsToMany, MorphOne,
  MorphTo, MorphMany, MorphToMany, OnDelete } from 'pinia-orm/decorators';

/**
 * 用户数据模型 - 用于存储用户中心的图表和表格数据
 */
export class UserData extends Model {
  static override entity = 'userData'

  @Uid() declare id: string
  @Str('') declare type: string // 'chart' 或 'table'
  @Str('') declare title: string // 图表标题
  @Num(0) declare value: number // 图表值
  @Attr([]) declare list: any[] // 图表数据列表
  @Str('') declare bid: string // 业务ID
  @Str('') declare pid: string // 项目ID
  @Str('') declare name: string // 名称
  @Str('') declare time: string // 时间
  @Str('') declare businessType: string // 业务类型
  @Str('') declare status: string // 状态
}
