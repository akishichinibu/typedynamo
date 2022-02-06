import { randomUUID } from 'crypto';
import { MetadataManager } from "@akishichinibu/typedmeta";
import { Expose, Transform } from 'class-transformer';

import { StringKeyof } from 'src/common/type.utilities';
import { BaseEntity } from 'src/base.entity';
import { EntityMetadataManager } from 'src/metadata';


export interface AttributeProps<TEntity extends BaseEntity, TProperty extends StringKeyof<TEntity> = any> {
  unique?: boolean;
  builder?: (self: TEntity) => TEntity[TProperty] | undefined;
  autoUpdate?: boolean;
}

export function Attribute<TEntity extends BaseEntity, TField extends StringKeyof<TEntity>>(
  props?: AttributeProps<TEntity, TField>,
): PropertyDecorator {
  return (target, propertyKey) => {
    const p = propertyKey.toString() as any;
    const m = EntityMetadataManager.fromEntity(target as any);
    
    m.setSelfMetadata("attributes", m.getSelfMetadata("attributes").add(p));

    // if (props?.autoUpdate ?? false) {
    //   Transform(({ obj }) => props?.builder!(obj))(target, propertyKey);
    // }
    m.setSelfPropertyMetadata(p, "attributeName", p);
    Expose()(target, propertyKey);
  };
}

export function UidAttribute<TEntity extends BaseEntity>(): PropertyDecorator {
  return (target, propertyKey) => {
    return Attribute({
      unique: false,
      builder: () => randomUUID(),
    })(target, propertyKey);
  };
}
