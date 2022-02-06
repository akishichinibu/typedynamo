import { DTAttributeValue, TypedResolver } from './dtype';
import {
  UnaryOperators,
  BinaryOperators,
  TernaryOperators,
  UnaryLogicalOperators,
  BinaryLogicalOperators,
} from './operators';

import { ExclusiveRecord, ToUnionType } from './type.utilities';

type UnaryOprand = [DTAttributeValue];

type BinaryOprand = [DTAttributeValue, DTAttributeValue];

type TripleOprand = [DTAttributeValue, DTAttributeValue, DTAttributeValue];

type RawUnaryExpression = ExclusiveRecord<UnaryOperators, UnaryOprand>;

type RawBinaryExpression = ExclusiveRecord<BinaryOperators, BinaryOprand>;

type RawTripleExpression = ExclusiveRecord<TernaryOperators, TripleOprand>;

type RawUnaryLogicalExpression = ExclusiveRecord<UnaryLogicalOperators, [RawExpression]>;

type RawBinaryLogicalOperatorExpression = ExclusiveRecord<BinaryLogicalOperators, RawExpression[]>;

export type RawExpression =
  | RawUnaryExpression
  | RawBinaryExpression
  | RawTripleExpression
  | RawUnaryExpression
  | RawUnaryLogicalExpression
  | RawBinaryLogicalOperatorExpression;

type PickRawBinaryOperator<TOps> = ToUnionType<TOps> extends ToUnionType<BinaryOperators>
  ? ExclusiveRecord<TOps, BinaryOprand>
  : never;

type PickRawTripleOperator<TOps> = ToUnionType<TOps> extends ToUnionType<TernaryOperators>
  ? ExclusiveRecord<TOps, TripleOprand>
  : never;

export type RawKeyConditionsBinary = PickRawBinaryOperator<['EQ', 'LE', 'LT', 'GE', 'GT', 'BEGINS_WITH']>;

export type RawKeyConditionsTriple = PickRawTripleOperator<['BETWEEN']>;

export type RawKeyConditions = RawKeyConditionsBinary | RawKeyConditionsTriple;

export type RawFilterConditions = RawExpression;
