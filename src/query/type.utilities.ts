import { BaseEntity, entityFieldsPropertyName } from 'src/base.entity';
import { StringKeyof } from '..';

export type GetEntityFields<TEntity> = TEntity extends BaseEntity<infer TFields> ? TFields : never;

export type ExclusivePick<TTarget, TTargetKey extends string> = {
  [TKey in keyof TTarget as TKey extends TTargetKey ? never : TKey]?: never;
} & {
    [TKey in keyof TTarget as TKey extends TTargetKey ? TKey : never]: TTarget[TTargetKey & keyof TTarget];
  };

export type ArrayStuct<TElement, Head extends TElement, Tail extends TElement[]> = [Head, ...Tail];

export type ToUnionType<T> = T extends []
  ? never
  : T extends ArrayStuct<string, infer Head, infer Tail>
  ? Head | ToUnionType<Tail>
  : never;

export type ExclusiveValue<TKeys, TTargetKey extends string, TValue> = {
  [TKey in ToUnionType<TKeys> as TKey extends TTargetKey ? never : TKey & string]?: never;
} & {
    [TKey in ToUnionType<TKeys> as TKey extends TTargetKey ? TKey : never]: TValue;
  };

export type ExclusiveSelectKeyWithValue<TTarget, TTargetKey extends string, TValue> = {
  [TKey in keyof TTarget as TKey extends TTargetKey ? never : TKey]?: never;
} & {
    [TKey in keyof TTarget as TKey extends TTargetKey ? TKey : never]: TValue;
  };

export type ExclusiveRecord<TKeys, TValue> = ExclusiveRecordImpl<TKeys, TKeys, TValue>;

type ExclusiveRecordImpl<TKeys, TRestKeys, TValue> = TKeys extends []
  ? never
  : TRestKeys extends ArrayStuct<string, infer Head, infer Tail>
  ? ExclusiveValue<TKeys, Head, TValue> | ExclusiveRecordImpl<TKeys, Tail, TValue>
  : never;
