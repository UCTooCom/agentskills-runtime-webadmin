import { Model } from 'pinia-orm'
import { Attr, Str, Uid } from 'pinia-orm/decorators'

export class Employee extends Model {
  static override entity = 'employees'

  @Uid() declare id: string
  @Str('') declare name: string
  @Str('') declare rank: string
  @Str('') declare description: string
  @Str('') declare createTime: string
  @Str('') declare status: string
  @Str('') declare type: string
  @Str('') declare roles: string
  @Str('') declare employeeNo: string
  @Str('') declare department: string
  @Str('') declare departmentLevel: string
  @Str('') declare workbenchName: string
  @Str('') declare project: string
  @Str('') declare address: string
  @Str('') declare lastUpdateUser: string
}
