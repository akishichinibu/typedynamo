type IfExtends<TFrom, TTo> = TFrom extends TTo ? true : false;

type IfReadonly<TTarget, TKey extends keyof TTarget> = IfExtends<Pick<TTarget, TKey>, Readonly<Pick<TTarget, TKey>>>;

export type IfFunction<TTarget> = IfExtends<TTarget, IFunction>;

type IfRequired<TTarget, Tkey extends keyof TTarget> = IfExtends<Pick<TTarget, Tkey>, Required<Pick<TTarget, Tkey>>>;

export type IFunction = (...args: any) => any;

export type TrueOrNerver<TCondition, TReturn> = TCondition extends true ? TReturn : never;

export type FalseOrNerver<TCondition, TReturn> = TCondition extends false ? TReturn : never;

export type StringKeyof<T> = keyof T & string;

export type WritableStringKeyof<T> = StringKeyof<{
  [TKey in StringKeyof<T> as FalseOrNerver<IfReadonly<T, TKey>, TKey>]: never;
}>;

export type Constructor<T> = { new (...args: any[]): T };

export type NonFunctionPropertyNames<T> = keyof NonFunctionProperties<T>;

export type NonFunctionProperties<T> = {
  [K in StringKeyof<T> as FalseOrNerver<IfFunction<T[K]>, K>]: T[K];
};

export type FunctionPropertyNames<T> = keyof FunctionProperties<T>;

export type FunctionProperties<T> = {
  [K in StringKeyof<T> as TrueOrNerver<IfFunction<T[K]>, K>]: T[K];
};

export type OnlyRequired<TTarget> = {
  [TKey in StringKeyof<TTarget> as TrueOrNerver<IfRequired<TTarget, TKey>, TKey>]: TTarget[TKey];
};

export type OnlyOptional<TTarget> = {
  [TKey in StringKeyof<TTarget> as FalseOrNerver<IfRequired<TTarget, TKey>, TKey>]?: TTarget[TKey] | undefined;
};

export type OnlyReadonlyKey<TTarget> = StringKeyof<{
  [TKey in StringKeyof<TTarget> as FalseOrNerver<IfReadonly<TTarget, TKey>, TKey>]: never;
}>;

export type OnlyFunctionPropertyKey<TTarget> = StringKeyof<{
  [TKey in StringKeyof<TTarget> as TrueOrNerver<IfFunction<TTarget[TKey]>, TKey>]: never;
}>;

export type IsomorphismInterface<TTarget> = Omit<
  OnlyRequired<TTarget> & OnlyOptional<TTarget>,
  OnlyReadonlyKey<TTarget> | OnlyFunctionPropertyKey<TTarget>
>;
