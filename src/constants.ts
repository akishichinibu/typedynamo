export const PARTITION_KEY_NAME = 'PK';
export const SORT_KEY_NAME = 'SK';

export const LOCAL_INDEX_PREFIX = 'LSI';
export const GLOBAL_INDEX_PREFIX = 'GSI';

export const getLocalIndexName = (order: number) => `${LOCAL_INDEX_PREFIX}_${order}`;
export const getLocalIndexSortKey = (order: number) => `${getLocalIndexName(order)}_${SORT_KEY_NAME}`;

export const getGlobalSeconderyIndexName = (order: number) => `${GLOBAL_INDEX_PREFIX}_${order}`;

export const getGlobalIndexPartitionKey = (order: number) =>
  `${getGlobalSeconderyIndexName(order)}_${PARTITION_KEY_NAME}`;
export const getGlobalIndexSortKey = (order: number) => `${getGlobalSeconderyIndexName(order)}_${SORT_KEY_NAME}`;

export const METADATA_INDEX_COMPONMENT = 'index:primary';

export const METADATA_DESPERATED_ATTRIBUTE_KEY_SET = 'desperated';
export const METADATA_ENTITY_ATTRIBUTE_KEY_SET = 'attributes';
export const METADATA_INDEX_ATTRIBUTE_KEY_SET = 'indexes';

export const METADATA_ENTITY_MARK = '__entity__';
