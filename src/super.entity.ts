import { IsISO8601, IsNotEmpty, IsNumber, IsOptional, Min, validateSync } from 'class-validator';
// import { InterfaceType, Field } from 'type-graphql';
// import { IsomorphismInterface, StringKeyof, now, empty } from './common';

// import { PrimaryPartitionKey, PrimarySortKey, SuperUidAttribute } from './decorator';
// import { EntityMetadataManager } from './metadata/entity.manager';
// import { ManagerGroup } from './super.table';

// import { AppSyncField, SuperAttribute } from 'src/decorator';
// import { ScalarType } from '@typedorm/common';

// export type InternalReadonlyField = 'PK' | 'SK';

// export type InternalWritableField = 'createdAt' | 'updatedAt' | 'deletedAt' | 'expiredAt' | 'uid';

// export type EntityFactoryInterface<T extends SuperBaseEntity> = Omit<
//   IsomorphismInterface<T>,
//   InternalReadonlyField | InternalWritableField
// >;

// interface IndexGroup {
//   GSI: Array<string>;
// }

// type Querier<TReturn> = (manager: ManagerGroup, index: IndexGroup) => Promise<TReturn>;

// @InterfaceType('BaseEntity')
// export abstract class SuperBaseEntity {
//   protected static get manager() {
//     return EntityMetadataManager.fromEntityConstructor(this as any);
//   }

//   protected static get indexes() {
//     return this.manager.parseIndexDefinition();
//   }

//   static get PKAttributes(): string[] {
//     const { pk } = this.indexes.get(0)!;
//     return pk;
//   }

//   static get SKAttributes(): string[] {
//     const { sk } = this.indexes.get(0)!;
//     return sk;
//   }

//   protected get prototype_() {
//     return Object.getPrototypeOf(this);
//   }

//   protected get constructor_() {
//     return this.prototype_.constructor;
//   }

//   @AppSyncField()
//   get PK(): string {
//     return this.constructor_.PKAttributes.map((p: any) => (this as any)[p] as string).join('#');
//   }

//   @AppSyncField((_) => String)
//   get SK(): string {
//     return this.constructor_.SKAttributes.map((p: any) => (this as any)[p] as string).join('#');
//   }

//   @PrimaryPartitionKey()
//   @SuperUidAttribute()
//   uid!: string;

//   @PrimarySortKey()
//   @SuperAttribute({ default_: now })
//   @IsISO8601()
//   @IsOptional()
//   createdAt?: string;

//   @SuperAttribute({ default_: now, autoUpdate: true })
//   @IsISO8601()
//   @IsOptional()
//   updatedAt?: string;

//   @SuperAttribute({ default_: empty })
//   @IsOptional()
//   deletedAt?: string;

//   @SuperAttribute<SuperBaseEntity, 'expiredAt'>({
//     default_: empty,
//   })
//   @IsNumber()
//   @Min(0)
//   @IsOptional()
//   expiredAt?: number;

//   protected initAttributes() {
//     const manager = EntityMetadataManager.fromInstance(this);

//     Array.from(manager.findAllEntityAttributes())
//       .filter(([_, { default_ }]) => default_ !== undefined)
//       .map(([attrName, { default_ }]) => {
//         (this as any)[attrName] = default_!(this) as any;
//       });
//   }

//   protected validate() {
//     const errors = validateSync(this, {
//       stopAtFirstError: true,
//     });

//     if (errors.length > 0) {
//       throw new Error(errors[0].toString());
//     }
//   }

//   static of<TEntityClz extends typeof SuperBaseEntity>(
//     this: TEntityClz,
//     obj: EntityFactoryInterface<InstanceType<TEntityClz>>,
//   ): InstanceType<TEntityClz> {
//     const inst = new (this as any)() as InstanceType<TEntityClz>;
//     Object.assign(inst, obj);

//     inst.initAttributes();
//     inst.validate();
//     return inst;
//   }

//   static getAll<TEntityClz extends typeof SuperBaseEntity>(
//     this: TEntityClz,
//     select?: Array<StringKeyof<InstanceType<TEntityClz>>>,
//   ): Querier<InstanceType<TEntityClz>[]> {
//     return async ({ scan }) => {
//       const result = await scan.find<InstanceType<TEntityClz>>(this, {
//         select,
//       });

//       return result.items ?? [];
//     };
//   }

//   static getByPKSK<TEntityClz extends typeof SuperBaseEntity>(
//     this: TEntityClz,
//     Components: { [key: string]: ScalarType },
//     select?: Array<StringKeyof<InstanceType<TEntityClz>>>,
//   ): Querier<InstanceType<TEntityClz>> {
//     this.PKAttributes.forEach((a) => {
//       if (!(a in Components)) {
//         throw new Error(`The Primary Partition Key Component ${a} doesn't contain in PKComponents`);
//       }
//     });

//     this.SKAttributes.forEach((a) => {
//       if (!(a in Components)) {
//         throw new Error(`The Primary Sort Key  Component ${a} doesn't contain in PKComponents`);
//       }
//     });

//     return async ({ entity }) => {
//       return await entity.findOneOrFailed<InstanceType<TEntityClz>>(
//         this,
//         {
//           ...Components,
//         } as any,
//         {
//           select,
//         },
//       );
//     };
//   }
// }
