import * as c from 'src/constants';
import { EntityMetadataManager } from 'src/metadata/entity.manager';

export interface IndexDefinition {
  pk: string[];
  sk: string[];
}

export function createEmptyIndexDefinition(): IndexDefinition {
  return { pk: [], sk: [] };
}

export interface IndexComponment {
  indexIndex: number;
  partKey: keyof IndexDefinition;
  componmentIndex: number;
}

function secondaryIndexComponmentDecoratorBuilder(partKey: keyof IndexDefinition) {
  return function (indexIndex: number, componmentIndex: number = 0): PropertyDecorator {
    return (target, propertyKey) => {
      const p = propertyKey.toString();

      const manager = EntityMetadataManager.fromPrototype(target);
      manager.indexComponent = manager.indexComponent.add(p);

      const data: IndexComponment = {
        indexIndex,
        partKey,
        componmentIndex,
      };

      manager.setSelfPropertyMetadata(p, c.METADATA_INDEX_COMPONMENT, data);
    };
  };
}

function primaryIndexComponmentDecoratorBuilder(partKey: keyof IndexDefinition) {
  const proxy = secondaryIndexComponmentDecoratorBuilder(partKey);
  return (componmentIndex: number = 0) => proxy(0, componmentIndex);
}

export const PrimaryPartitionKey = primaryIndexComponmentDecoratorBuilder('pk');
export const PrimarySortKey = primaryIndexComponmentDecoratorBuilder('sk');

export const GSIPartitionKey = secondaryIndexComponmentDecoratorBuilder('pk');
export const GSISortKey = secondaryIndexComponmentDecoratorBuilder('sk');
