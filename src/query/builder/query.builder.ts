import { QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { Constructor } from "src/common";
import { BaseEntity } from "src/base.entity";
import { dtypeResolver } from "../dtype";
import { SortKeyConditions, Expression, FilterConditions, PrimaryKeyEqualCondition } from "../entity.expression";
import { RawExpression, RawFilterConditions, RawKeyConditions } from "../raw.expression";
import { CommandBuilder } from "./command.builder";


interface QueryCommandBuilderProps<TEntity> {
  readonly partitionKeyValue: string;
  readonly sortKeyCondition?: SortKeyConditions<TEntity>;
  queryFilter?: FilterConditions<TEntity>;
}


export class QueryCommandBuilder<TEntity extends BaseEntity> extends CommandBuilder<TEntity, QueryCommand> {

  protected constructor(
    private readonly EntityClz: Constructor<TEntity>,
    private readonly partitionKeyValue: string,
    private readonly sortKeyCondition?: SortKeyConditions<TEntity>,
    private queryFilter?: FilterConditions<TEntity>,
  ) {
    super();
  }

  static from<T extends BaseEntity>(EntityClz: Constructor<T>, props: QueryCommandBuilderProps<T>) {
    return new this<T>(
      EntityClz,
      props.partitionKeyValue,
      props.sortKeyCondition,
      props.queryFilter,
    );
  }

  toCommand() {
    const partitionKeyCondition: PrimaryKeyEqualCondition<TEntity> = {
      "EQ": {
        "PK": this.partitionKeyValue,
      }
    };

    const keyCondition = this.resolveToRawExpression({
      AND: [
        partitionKeyCondition,
        this.sortKeyCondition!,
      ],
    });

    const queryFilter = this.queryFilter && this.resolveToRawExpression(this.queryFilter as Expression<TEntity>) as RawExpression;

    const attributes = Object.fromEntries(this.expressionTable.entries());
    const values = Object.fromEntries(Array.from(this.valueTable.entries()).map(([k, v]) => [k, dtypeResolver(v)]));

    const input = {
      "TableName": "",

      "KeyConditionExpression": this.rawExpressionToString(keyCondition),
      "FilterExpression": queryFilter && this.rawExpressionToString(queryFilter),
      "ExpressionAttributeNames": attributes,
      "ExpressionAttributeValues": values,
    }

    return new QueryCommand(input);
  }
}
