import { Attribute, DesperatedAttribute, Entity } from "src/decorator";
import { GetEntityFields } from "src/query/type.utilities";
import { BaseEntity } from "src/base.entity";


class eAuthId extends BaseEntity {

  @DesperatedAttribute()
  PK!: string;

  @DesperatedAttribute()
  SK!: string;

  authId!: string;

  provider!: string;

}


@Entity()
class eUser extends BaseEntity<[
  'email',
  'age',
  'valid',
  'lastName',
  ...GetEntityFields<BaseEntity>,
]> {
  
  @Attribute()
  email!: string;

  @Attribute()
  age?: number;

  @Attribute()
  valid!: boolean;

  @Attribute()
  lastName!: string[];

  @Attribute()
  authIds: eAuthId[] = [];

}


export { 
  eUser,
}
