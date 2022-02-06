import { MetadataManager } from "@akishichinibu/typedmeta";
import { Attribute, Constructor, IsomorphismInterface, StringKeyof } from ".";

export const entityFieldsPropertyName = '__field__' as const;

export const PARTITION_KEY_NAME = 'PK';
export const SORT_KEY_NAME = 'SK';

export const LOCAL_INDEX_PREFIX = 'LSI';
export const GLOBAL_INDEX_PREFIX = 'GSI';

export type InternalWritableField = 'createdAt' | 'updatedAt' | 'deletedAt' | 'expiredAt' | 'uid';

export type InternalReadonlyField = Exclude<StringKeyof<BaseEntity<string[]>>, InternalWritableField> | 'fromDynamo';

export type EntityFactoryInterface<T> = Omit<
  IsomorphismInterface<T>,
  InternalReadonlyField | InternalWritableField
>;

export class BaseEntity<TFields = ['uid', 'createdAt', 'updatedAt', 'deletedAt', 'expiredAt', 'PK', "SK"]> {
  [entityFieldsPropertyName]!: TFields;

  constructor() { };

  static get PKAttributes(): string[] {
    return [];
  }

  static get SKAttributes(): string[] {
    return [];
  }

  @Attribute()
  PK!: string;

  @Attribute()
  SK!: string;

  @Attribute()
  entity!: string;

  @Attribute()
  createdAt!: string;

  @Attribute()
  updatedAt!: string;

  @Attribute()
  deletedAt!: string;

  @Attribute()
  expiredAt?: number;

  protected init() {
    const m = MetadataManager.fromInstance(this, EntityMetadataSchema, EntityFieldMetadataSchema);
    const attrs = m.getSelfMetadata("attributes", { inherit: "merge" });

    Array
      .from(attrs)
      .filter((a) => {
        const name = m.getSelfPropertyMetadata(a, "attributeName");
        console.log("@@", name);
      })

    // const manager = EntityMetadataManager.fromInstance(this);

    // Array.from(manager.findAllEntityAttributes())
    //   .filter(([_, { default_ }]) => default_ !== undefined)
    //   .map(([attrName, { default_ }]) => {
    //     (this as any)[attrName] = default_!(this) as any;
    //   });
  }

  protected validate() {
    // const errors = validateSync(this, {
    //   stopAtFirstError: true,
    // });

    // if (errors.length > 0) {
    //   throw new Error(errors[0].toString());
    // }
  }

  static of<TEntity extends BaseEntity<string[]>>(
    this: Constructor<TEntity>,
    obj: EntityFactoryInterface<TEntity>,
  ): TEntity {
    const inst = new (this as any)() as TEntity;
    Object.assign(inst, obj);

    inst.init();
    inst.validate();
    return inst;
  }

  static fromDynamo() {

  }

  toDynamo() {

  }

}

class P extends BaseEntity<string> { };

