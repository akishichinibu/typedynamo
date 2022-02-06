type DTBinary = { B: Buffer };

type DTBoolean = { BOOL: boolean };

type DTBinarySet = { BS: Array<DTBinary['B']> };

type DTList = { L: Array<DTAttributeValue> };

type DTMap = { M: { [key: string]: DTAttributeValue } };

type DTNumber = { N: string };

type DTNumberSet = { NS: Array<DTNumber['N']> };

type DTNull = { NULL: boolean };

type DTString = { S: string };

type DTStringSet = { SS: Array<DTString['S']> };

export type DTAttributeValue =
  | DTBinary
  | DTBoolean
  | DTBinarySet
  | DTList
  | DTMap
  | DTNumber
  | DTNumberSet
  | DTNull
  | DTString
  | DTStringSet
  | never;

export type TypedResolver<T> = T extends boolean
  ? DTBoolean
  : T extends number
  ? DTNumber
  : T extends string
  ? DTString
  : T extends null
  ? DTNull & { NULL: true }
  : T extends Buffer
  ? DTBinary
  : T extends number[]
  ? DTNumberSet
  : T extends string[]
  ? DTStringSet
  : T extends DTAttributeValue[]
  ? DTList
  : T extends { [key: string]: DTAttributeValue }
  ? DTMap
  : never;

export function dtypeResolver(data: any): DTAttributeValue {
  const dtype = typeof data;

  if (Array.isArray(data)) {
    return dtypeResolver(data[0]);
  } else {
    switch (dtype) {
      case 'boolean':
        return { BOOL: data };
      case 'number':
        return { N: data };
      case 'string':
        return { S: data };
      default: {
        throw new Error('dtype error');
      }
    }
  }
}
