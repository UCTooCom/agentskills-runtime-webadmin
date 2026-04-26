import { Model } from 'pinia-orm'
import { Attr, Str, Uid } from 'pinia-orm/decorators'

export class ProfileVersion extends Model {
  static override entity = 'profileVersions'

  @Uid() declare id: string
  @Str('') declare version: string
  @Str('') declare operation: string
  @Str('') declare updated: string
  @Str('') declare time: string
}

export class ProfileProject extends Model {
  static override entity = 'profileProjects'

  @Uid() declare id: string
  @Str('') declare name: string
}
