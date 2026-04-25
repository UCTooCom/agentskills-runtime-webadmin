import { Model } from 'pinia-orm'
import { Attr, Str, Uid, Num, Bool, HasOne, HasMany, BelongsTo, HasManyBy, BelongsToMany, MorphOne,
  MorphTo, MorphMany, MorphToMany, OnDelete } from 'pinia-orm/decorators'

export class BoardOption extends Model {
  static override entity = 'boardOptions'

  @Uid() declare id: string
  @Str('') declare type: string // 'userData' | 'userPractic' | 'userTrain'
  @Str('') declare value: string
  @Str('') declare label: string
  @Str('') declare description: string
  @Str('') declare label1: string
  @Str('') declare label2: string
  @Bool(false) declare isNews: boolean
}
