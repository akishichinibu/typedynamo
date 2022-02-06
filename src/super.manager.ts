import { EntityAttributes, EntityTarget } from '@typedorm/common';
// import { EntityManager, EntityManagerFindOneOptions, EntityManagerFindOptions } from '@typedorm/core';

// import { ScanManager, ScanManagerFindOptions } from '@typedorm/core/src/classes/manager/scan-manager';
// import { MetadataOptions } from '@typedorm/core/src/classes/transformer/base-transformer';

// import { SuperBaseEntity } from './super.entity';
// import { now, nowTimestamp } from './common';
// import { ObjectNotFoundError } from './exception';

// const filterDeletedAndExpired: any = {
//   deletedAt: {
//     EQ: '',
//   },
//   NOT: {
//     expiredAt: {
//       LE: nowTimestamp(),
//     },
//   },
// };

// export class SuperEntityManager extends EntityManager {
//   async findOne<Entity, PrimaryKey = Partial<Entity>>(
//     entityClass: EntityTarget<Entity>,
//     primaryKeyAttributes: PrimaryKey,
//     options?: EntityManagerFindOneOptions<Entity>,
//     metadataOptions?: MetadataOptions,
//   ) {
//     const result = await super.findOne<Entity>(entityClass, primaryKeyAttributes, options, metadataOptions);

//     if (result === undefined) {
//       return result;
//     } else {
//       const r = result as unknown as SuperBaseEntity;

//       if (r.deletedAt !== undefined || (r.expiredAt ?? 0) >= nowTimestamp()) {
//         return undefined;
//       } else {
//         return result;
//       }
//     }
//   }

//   async find<Entity, PartitionKey = Partial<EntityAttributes<Entity>>>(
//     entityClass: EntityTarget<Entity>,
//     partitionKey: PartitionKey,
//     queryOptions?: EntityManagerFindOptions<Entity, PartitionKey>,
//     metadataOptions?: MetadataOptions,
//   ) {
//     const options = queryOptions ?? {};

//     // @ts-ignore
//     options.where = {
//       AND: {
//         ...options.where,
//         ...filterDeletedAndExpired,
//       },
//     };

//     return await super.find(entityClass, partitionKey, options, metadataOptions);
//   }

//   async findOneOrFailed<Entity, PrimaryKey = Partial<Entity>>(
//     entityClass: EntityTarget<Entity>,
//     primaryKeyAttributes: PrimaryKey,
//     options?: EntityManagerFindOneOptions<Entity>,
//     metadataOptions?: MetadataOptions,
//   ): Promise<Entity> {
//     const result = await this.findOne(entityClass, primaryKeyAttributes, options, metadataOptions);

//     if (result === undefined) {
//       throw new ObjectNotFoundError();
//     }

//     return result;
//   }

//   async queryOneOrFailed<Entity, PartitionKey = Partial<EntityAttributes<Entity>>>(
//     entityClass: EntityTarget<Entity>,
//     partitionKey: PartitionKey,
//     queryOptions?: EntityManagerFindOptions<Entity, PartitionKey>,
//     metadataOptions?: MetadataOptions,
//   ): Promise<Entity> {
//     const result = await this.find(entityClass, partitionKey, queryOptions, metadataOptions);
//     const length = result.items?.length ?? 0;

//     if (length === 0) {
//       throw new ObjectNotFoundError();
//     }

//     if (length > 1) {
//       throw new ObjectNotFoundError();
//     }

//     return result.items[0];
//   }

//   static fromManager(manager: EntityManager) {
//     return new SuperEntityManager(manager['connection']);
//   }
// }

// export class SuperScanManager extends ScanManager {
//   async find<Entity>(
//     entityClass: EntityTarget<Entity>,
//     findOptions?: ScanManagerFindOptions<Entity>,
//     metadataOptions?: MetadataOptions,
//   ) {
//     const options = findOptions ?? {};

//     options.select = [...(options.select ?? []), '__en'] as any;

//     // @ts-ignore
//     options.where = {
//       AND: {
//         ...options.where,
//         ...filterDeletedAndExpired,
//       },
//     };

//     return await super.find(entityClass, options, metadataOptions);
//   }

//   async findOneOrFailed<Entity>(
//     entityClass: EntityTarget<Entity>,
//     findOptions?: ScanManagerFindOptions<Entity>,
//     metadataOptions?: MetadataOptions,
//   ): Promise<Entity> {
//     const result = await this.find(entityClass, findOptions, metadataOptions);
//     const length = result.items?.length ?? 0;

//     if (length === 0) {
//       throw new ObjectNotFoundError();
//     }

//     if (length > 1) {
//       throw new ObjectNotFoundError();
//     }

//     return result.items![0];
//   }

//   static fromManager(manager: ScanManager) {
//     return new SuperScanManager(manager['connection']);
//   }
// }
