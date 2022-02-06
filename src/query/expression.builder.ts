import { QueryCommand, QueryCommandInput } from '@aws-sdk/client-dynamodb';
import { BaseEntity } from 'src/base.entity';
import { Expression, FilterConditions, SortKeyConditions } from './entity.expression';
import { RawExpression, RawKeyConditions } from './raw.expression';
import { binaryOperators, ternaryOperators, unaryOperators } from './operators';
import { dtypeResolver } from './dtype';

type DynamoDBQueryExpression = Pick<
  QueryCommandInput,
  'FilterExpression'
>;

// new QueryCommand({
//   TableName: '',
//   IndexName: '',
//   Select: '',
//   Limit: 0,
//   ConsistentRead: true,
//   FilterExpression: '',
//   ...builder.toQuery(),
// });



export class FilterExpressionBuilder<TEntity> extends CommandBuilder<TEntity> {

  constructor(
    private readonly expression: FilterConditions<TEntity>,
  ) {
    super();
  }

  toQuery(): DynamoDBQueryExpression {
    const keyCondition = this.resolveToRawExpression(this.expression as Expression<TEntity>) as RawKeyConditions;
    return {
      'FilterExpression': {

      },
      "KeyConditionExpression": this.toKeyCondtionString(keyCondition),
      "ExpressionAttributeNames": Object.fromEntries(this.expressionTable.entries()),
      "ExpressionAttributeValues": Object.fromEntries(Array.from(this.valueTable.entries()).map(([k, v]) => [k, dtypeResolver(v)])),
    }
  }
}
