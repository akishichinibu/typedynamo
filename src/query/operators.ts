export type UnaryOperators = ['NOT_NULL', 'NULL'];

export type BinaryOperators = [
  'EQ',
  'NE',
  'LE',
  'LT',
  'GE',
  'GT',
  'CONTAINS',
  'NOT_CONTAINS',
  'BEGINS_WITH',
  'IN',
  'NE',
];

export type TernaryOperators = ['BETWEEN'];

export type UnaryLogicalOperators = ['NOT', ];

export type BinaryLogicalOperators = ['AND', 'OR'];

export const unaryOperators: string[] = ['NOT_NULL', 'NULL'];

export const binaryOperators: string[] = [
  'EQ',
  'NE',
  'LE',
  'LT',
  'GE',
  'GT',
  'CONTAINS',
  'NOT_CONTAINS',
  'BEGINS_WITH',
  'IN',
  'NE',
];

export const ternaryOperators: string[] = [
  "BETWEEN",
];
