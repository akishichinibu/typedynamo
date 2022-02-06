import { Expose } from 'class-transformer';
import { IsEmpty } from 'class-validator';
import { BaseEntity } from 'src/base.entity';
import { EntityMetadataManager } from 'src/metadata/entity.manager';
import { Attribute } from './attribute.decorator';

interface DesperatedAttributeProps<TEntity extends BaseEntity> {
  latest: keyof TEntity & string;
}

export function DesperatedAttribute<TEntity extends BaseEntity>(
  props?: DesperatedAttributeProps<TEntity>,
): PropertyDecorator {
  return (target, propertyKey) => {
    const p = propertyKey.toString();

    // const manager = EntityMetadataManager.fromPrototype(target);
    // manager.desperatedAttributes = manager.desperatedAttributes.add(p);
    // console.log('Here!', p);

    IsEmpty({
      message: `The attribute ${p} is desperated and should NOT be presented. `,
    })(target, propertyKey);

    Expose({ toClassOnly: true })(target, propertyKey);
    // TransformFromDynamo(() => undefined)(target, propertyKey);
  };
}

interface LatestAttributeProps<TEntity extends BaseEntity> {
  previous: keyof TEntity & string;
  force?: boolean;
}

export function LatestAttribute<TEntity extends BaseEntity>(
  props: LatestAttributeProps<TEntity>,
): PropertyDecorator {
  return (target, propertyKey) => {
    const p = propertyKey.toString();
    // const manager = EntityMetadataManager.fromPrototype(target);
    // manager.entityAttributes = manager.entityAttributes.set(p as any, {});

    Attribute()(target, propertyKey);
    Expose()(target, propertyKey);
    // TransformFromDynamo(({ obj }) => obj[props.previous])(target, propertyKey);
  };
}
