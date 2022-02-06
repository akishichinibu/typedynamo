// import * as c from 'src/constants';
// import { IndexDefinitionError } from 'src/exception';
// import { Constructor, findOnPrototypeChain, StringKeyof } from 'src/common';
// import { MetadataManager } from 'src/common/metadata.manager';

import { BasePropertySchema, BaseSchema, MetadataManager } from "@akishichinibu/typedmeta";
import { Constructor } from "src/common";
import { BaseEntity } from "src/base.entity";


export class EntityFieldMetadataSchema extends BasePropertySchema<BaseEntity> {

  attributeName?: string = undefined;

  partitionKey?: number = undefined;

  sortedKey?: number = undefined;

}

export class EntityMetadataSchema extends BaseSchema<BaseEntity, EntityFieldMetadataSchema> {

  entityName!: string;

  attributes: Set<keyof BaseEntity | string> = new Set();

  desperatedAttributes: Set<keyof BaseEntity> = new Set();

  indexComponent: Map<number, Set<string>> = new Map();

}

export class EntityMetadataManager<TEntityClz extends Constructor<BaseEntity<string[]>>> extends MetadataManager<
  TEntityClz,
  EntityFieldMetadataSchema,
  EntityMetadataSchema
> {

  static fromEntity<TEntity extends BaseEntity<string[]>>(EntityClz: Constructor<TEntity>) {
    const m = MetadataManager.fromConstructor<TEntity, EntityMetadataSchema>(EntityClz, EntityMetadataSchema, EntityFieldMetadataSchema);
    return m as unknown as EntityMetadataManager<Constructor<BaseEntity<string[]>>>;
  }

  addAttribute(name: string) {
    this.setSelfMetadata("attributes", this.getSelfMetadata("attributes").add(name));
  }

  
  findAllEntityAttributes() {
    this.getPrototypeChain(BaseEntity).map((p) => {
      const m = EntityMetadataManager.fromConstructor(p, this.Schema, this.PropertySchema);
    })

    const protos = findOnPrototypeChain(this.self_, SuperBaseEntity);
    const ms = protos.map((p) => EntityMetadataManager.fromEntityConstructor(p));

    const result: EntityAttributeCollection<TEntityClz> = new Map();

    ms.forEach((m) => {
      for (const [k, v] of m.entityAttributes) {
        !this.desperatedAttributes.has(k) && result.set(k as any, v);
      }
    });

    return result;
  }

}


interface AttributeProps<TEntity extends SuperBaseEntity> {
  default_?: (self: TEntity) => any;
  autoUpdate?: boolean;
}

type EntityAttributeCollection<TEntityClz extends Constructor<SuperBaseEntity>> = Map<
  Exclude<StringKeyof<InstanceType<TEntityClz>>, InternalReadonlyField>,
  AttributeProps<InstanceType<TEntityClz>>
>;

export class EntityMetadataManager2<
  TEntityClz extends Constructor<SuperBaseEntity>,
> extends MetadataManager<TEntityClz> {
  private static cache = new WeakMap<any, EntityMetadataManager<Constructor<SuperBaseEntity>>>();

  protected constructor(Clz: TEntityClz) {
    super(Clz);
  }

  static fromEntityConstructor(Clz: Constructor<SuperBaseEntity>) {
    if (this.cache.has(Clz)) {
      const r = this.cache.get(Clz);
      if (r !== undefined) {
        return r;
      }
    }
    const r = new this(Clz);
    this.cache.set(Clz, r);
    return r;
  }

  static fromPrototype(proto: any) {
    return this.fromEntityConstructor(proto.constructor);
  }

  static fromInstance(self: any) {
    return this.fromEntityConstructor(self.constructor);
  }

  markAsEntity() {
    this.setSelfMetadata(c.METADATA_ENTITY_MARK, true);
  }

  get desperatedAttributes() {
    return this.getSelfMetadata(c.METADATA_DESPERATED_ATTRIBUTE_KEY_SET) ?? new Set();
  }

  set desperatedAttributes(attrs: Set<string>) {
    this.setSelfMetadata(c.METADATA_DESPERATED_ATTRIBUTE_KEY_SET, attrs);
  }

  get entityAttributes(): EntityAttributeCollection<TEntityClz> {
    return this.getSelfMetadata(c.METADATA_ENTITY_ATTRIBUTE_KEY_SET) ?? new Map();
  }

  set entityAttributes(attrs: EntityAttributeCollection<TEntityClz>) {
    this.setSelfMetadata(c.METADATA_ENTITY_ATTRIBUTE_KEY_SET, attrs);
  }

  findAllEntityAttributes(): EntityAttributeCollection<TEntityClz> {
    const protos = findOnPrototypeChain(this.self_, SuperBaseEntity);
    const ms = protos.map((p) => EntityMetadataManager.fromEntityConstructor(p));

    const result: EntityAttributeCollection<TEntityClz> = new Map();

    ms.forEach((m) => {
      for (const [k, v] of m.entityAttributes) {
        !this.desperatedAttributes.has(k) && result.set(k as any, v);
      }
    });

    return result;
  }

  findAllEntityAttributeKeys(): Array<string> {
    return Array.from(this.findAllEntityAttributes().keys()) as string[];
  }

  get indexComponent() {
    return this.getSelfMetadata(c.METADATA_INDEX_ATTRIBUTE_KEY_SET) ?? new Set();
  }

  set indexComponent(attrs: Set<string>) {
    this.setSelfMetadata(c.METADATA_INDEX_ATTRIBUTE_KEY_SET, attrs);
  }

  findAllIndexAttributeKeys(): Array<string> {
    const protos = findOnPrototypeChain(this.self_, SuperBaseEntity);
    const ms = protos.map((p) => EntityMetadataManager.fromEntityConstructor(p));

    const attrs = ms.flatMap((m) => Array.from(m.indexComponent).filter((r) => !this.desperatedAttributes.has(r)));
    return Array.from(new Set(attrs));
  }

  get entityName() {
    return this.self_.name;
  }

  getIndexComponmentKeyOnProperty(property: string) {
    return this.getSelfPropertyMetadata<IndexComponment>(property, c.METADATA_INDEX_COMPONMENT) ?? null;
  }

  // parseIndexDefinition() {
  //   const definition = new Map<number, IndexDefinition>();

  //   const protos = findOnPrototypeChain(this.self_, SuperBaseEntity);
  //   const ms = protos.map((p) => EntityMetadataManager.fromEntityConstructor(p));

  //   ms.map((m) => ({ manager: m, attributes: m.indexComponent }))
  //     .flatMap(({ manager, attributes }) =>
  //       Array.from(attributes)
  //         .filter((a) => !this.desperatedAttributes.has(a))
  //         .map((attribute) => {
  //           return {
  //             attribute,
  //             index: manager.getIndexComponmentKeyOnProperty(attribute),
  //           };
  //         }),
  //     )
  //     .forEach(({ attribute, index }) => {
  //       const { indexIndex, componmentIndex, partKey } = index!;

  //       const def = definition.get(indexIndex) ?? createEmptyIndexDefinition();
  //       def[partKey][componmentIndex] = attribute;
  //       definition.set(indexIndex, def);
  //     });

  //   console.debug(definition);

  //   for (const [indexIndex, { pk, sk }] of definition) {
  //     if (indexIndex === 0) {
  //       if (pk.length === 0 || sk.length === 0) {
  //         throw new IndexDefinitionError(this.self_, `Can't find the primary index definition. `);
  //       }
  //     }

  //     if (pk.includes(undefined as any)) {
  //       throw new IndexDefinitionError(this.self_, `Invalid partition key component: ${pk} for index ${indexIndex}. `);
  //     }

  //     if (sk.includes(undefined as any)) {
  //       throw new IndexDefinitionError(this.self_, `Invalid sort key component: ${sk} for index ${indexIndex}. `);
  //     }
  //   }

  //   return definition;
  // // }
}

// import { createEmptyIndexDefinition, IndexComponment, IndexDefinition } from 'src/decorator/index.decorator';
// import { SuperBaseEntity, InternalReadonlyField } from 'src/super.entity';
// import chalk from 'chalk';
