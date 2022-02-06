import { Constructor } from '.';
import { BaseEntity, PARTITION_KEY_NAME, SORT_KEY_NAME } from './base.entity';
import { Expression, FilterConditions, SortKeyConditions } from './query/entity.expression';

import { DynamoDBClient, GetItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { FilterCondition } from 'aws-sdk/clients/servicediscovery';
import { dtypeResolver } from './query/dtype';
import { QueryCommandBuilder } from './query/builder/query.builder';

const getClient = () => {
  return new DynamoDBClient({ region: 'us-west-2' });
};

interface QueryProps<TEntity extends BaseEntity> {
  readonly partitionKeyValue: string;
  readonly sortKeyCondition: SortKeyConditions<TEntity>;
  readonly queryFilter: FilterConditions<TEntity>;
}

export class Repository<TEntity extends BaseEntity> {
  protected constructor(readonly EntityClz: Constructor<TEntity>) {}

  private get client() {
    return getClient();
  }

  static from<TEntityClz extends typeof BaseEntity>(EntityClz: TEntityClz) {
    return new this(EntityClz);
  }

  async getItem(pk: string, sk: string) {
    const command = new GetItemCommand({
      TableName: "",
      Key: {
        [PARTITION_KEY_NAME]: dtypeResolver(pk),
        [SORT_KEY_NAME]: dtypeResolver(sk),
      },
    });

    return await this.client.send(command);
  }

  async query(props: QueryProps<TEntity>) {
    const builder = QueryCommandBuilder.from(this.EntityClz, {
      ...props,
    });

    const command = builder.toCommand();
    await this.client.send(command);
  }
}
