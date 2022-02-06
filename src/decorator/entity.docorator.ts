import { MetadataManager } from "@akishichinibu/typedmeta";
import { Exclude } from 'class-transformer';

import { Constructor } from '..';
import { BaseEntity } from 'src/base.entity';
import { EntityFieldMetadataSchema, EntityMetadataSchema } from './schema/entity.schema';


export interface EntityProps {
  name?: string;
}


export function Entity(props?: EntityProps) {
  return function(Clz: any) {
    const m = MetadataManager.fromConstructor(Clz as Constructor<BaseEntity>, EntityMetadataSchema, EntityFieldMetadataSchema);
    m.setSelfMetadata("entityName", props?.name ?? Clz.name);
    return Exclude()(Clz);
  };
}
