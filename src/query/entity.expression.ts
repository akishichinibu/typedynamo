import {
  UnaryOperators,
  BinaryOperators,
  TernaryOperators,
  UnaryLogicalOperators,
  BinaryLogicalOperators,
} from './operators';
import {
  ArrayStuct,
  ExclusivePick,
  ExclusiveRecord,
  ExclusiveSelectKeyWithValue,
  ExclusiveValue,
  GetEntityFields,
  ToUnionType,
} from './type.utilities';

type UnaryExpression<TEntity> = ExclusiveRecord<UnaryOperators, ToUnionType<GetEntityFields<TEntity>>>;

type ExclusiveBinaryOperand<TEntity, TKeys> = TKeys extends []
  ? never
  : TKeys extends ArrayStuct<string, infer Head, infer Tail>
  ? ExclusiveValue<TKeys, Head, TEntity[Head & keyof TEntity]> | ExclusiveBinaryOperand<TEntity, Tail>
  : never;

type ExclusiveTernaryOperand<TEntity, TKeys> = TKeys extends []
  ? never
  : TKeys extends ArrayStuct<string, infer Head, infer Tail>
  ?
  | ExclusiveSelectKeyWithValue<
    TEntity,
    Head,
    [TEntity[Head & keyof TEntity], TEntity[Head & keyof TEntity]]
  >
  | ExclusiveTernaryOperand<TEntity, Tail>
  : never;

type UnaryLogicalExpression<TEntity> = ExclusiveRecord<UnaryLogicalOperators, [Expression<TEntity>]>;

type RescrusiveLogicalOperatorExpression<TEntity> = ExclusiveRecord<BinaryLogicalOperators, Array<Expression<TEntity>>>;

type PickBinaryOperator<TEntity, TOps = BinaryOperators> = ToUnionType<TOps> extends ToUnionType<BinaryOperators>
  ? ExclusiveRecord<TOps, ExclusiveBinaryOperand<TEntity, GetEntityFields<TEntity>>>
  : never;

type PickTernaryOperator<TEntity, TOps = TernaryOperators> = ToUnionType<TOps> extends ToUnionType<TernaryOperators>
  ? ExclusiveRecord<TOps, ExclusiveTernaryOperand<TEntity, GetEntityFields<TEntity>>>
  : never;

export type PrimaryKeyEqualCondition<TEntity> =
  | ExclusiveRecord<['EQ',], ExclusiveBinaryOperand<TEntity, ["PK", ]>>
  | never;

export type SortKeyConditions<TEntity> =
  | ExclusiveRecord<['EQ', 'LE', 'LT', 'GE', 'GT', 'BEGINS_WITH'], ExclusiveBinaryOperand<TEntity, ["SK", ]>>
  | ExclusiveRecord<['BETWEEN'], ExclusiveBinaryOperand<TEntity, ["SK", ]>>
  | never;

export type FilterConditions<TEntity> =
  | UnaryExpression<TEntity>
  | PickBinaryOperator<TEntity>
  | PickTernaryOperator<TEntity>
  | never;

  export type Expression<TEntity> =
  | PrimaryKeyEqualCondition<TEntity>
  | SortKeyConditions<TEntity>
  | FilterConditions<TEntity>
  | UnaryLogicalExpression<TEntity>
  | RescrusiveLogicalOperatorExpression<TEntity>
  | never;
