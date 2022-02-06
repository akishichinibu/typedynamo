import { DynamoDB } from 'aws-sdk';

// import { EntityTarget, IndexOptions, INDEX_TYPE, Table, TableOptions } from '@typedorm/common';
// import {
//   getEntityManager,
//   getScanManager,
//   getBatchManager,
//   getTransactionManger,
//   createConnection,
//   Connection,
// } from '@typedorm/core';
// import { getGlobalSeconderyIndexName, getGlobalIndexPartitionKey, getGlobalIndexSortKey } from './constants';

// import { SuperEntityManager, SuperScanManager } from './super.manager';

// interface CreateTableOptions extends Pick<TableOptions, 'name'> {
//   entities: string;
//   numberOfGSI: number;
// }

// export interface ManagerGroup {
//   entity: SuperEntityManager;
//   scan: SuperScanManager;
//   batch: ReturnType<typeof getBatchManager>;
//   transaction: ReturnType<typeof getTransactionManger>;
// }

// export class SuperTable {
//   private connection: Connection | null;
//   private managerGroup: ManagerGroup | null;

//   protected constructor(private readonly table: Table, private readonly options: CreateTableOptions) {
//     this.connection = null;
//     this.managerGroup = null;
//   }

//   static create(options: CreateTableOptions) {
//     const indexEntites: Array<[string, IndexOptions]> = [];

//     for (let i = 1; i <= options.numberOfGSI; i++) {
//       const e: [string, IndexOptions] = [
//         getGlobalSeconderyIndexName(i),
//         {
//           type: INDEX_TYPE.GSI,
//           partitionKey: getGlobalIndexPartitionKey(i),
//           sortKey: getGlobalIndexSortKey(i),
//         },
//       ];
//       indexEntites.push(e);
//     }

//     const table = new Table({
//       name: options.name,
//       partitionKey: 'PK',
//       sortKey: 'SK',
//       indexes: Object.fromEntries(indexEntites),
//     });

//     return new SuperTable(table, options);
//   }

//   get documentClient() {
//     return new DynamoDB.DocumentClient({
//       region: 'ap-northeast-1',
//       logger: console,
//     });
//   }

//   connect(): ManagerGroup {
//     if (this.connection === null) {
//       this.connection = createConnection({
//         table: this.table,
//         entities: this.options.entities,
//         documentClient: this.documentClient,
//       });
//       this.managerGroup = {
//         entity: SuperEntityManager.fromManager(getEntityManager()),
//         scan: SuperScanManager.fromManager(getScanManager()),
//         batch: getBatchManager(),
//         transaction: getTransactionManger(),
//       };
//     }
//     return this.managerGroup!;
//   }
// }
