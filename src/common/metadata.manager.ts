export const generateInternalMetaKey = (key: string) => `super:${key}`;

export class MetadataManager<TTarget extends Object = Object> {
  constructor(protected readonly target: TTarget) {}

  protected getMetadata<TValue>(target: any, key: string): TValue | undefined {
    const r = Reflect.getOwnMetadata(generateInternalMetaKey(key), target);
    return r === undefined ? r : (r as TValue);
  }

  protected getAllMetadata(target: any): Record<string, any> {
    const keys = Reflect.getOwnMetadataKeys(target).filter((k) => (k as string).startsWith('super:'));
    const entities = keys.map((k) => [k, Reflect.getMetadata(k, target)]);
    return Object.fromEntries(entities);
  }

  protected getPropertyMetadata<TValue>(key: string, propertyKey: string): TValue | undefined {
    const r = Reflect.getOwnMetadata(generateInternalMetaKey(key), this.self_, propertyKey);
    return r === undefined ? r : (r as TValue);
  }

  protected setMetadata<TValue>(target: any, key: string, value: TValue): TValue {
    Reflect.defineMetadata(generateInternalMetaKey(key), value, target);
    return value;
  }

  protected setPropertyMetadata<TValue>(key: string, propertyKey: string, value: TValue): TValue {
    Reflect.defineMetadata(generateInternalMetaKey(key), value, this.self_, propertyKey);
    return value;
  }

  get self_() {
    return this.target;
  }

  get constructor_() {
    return this.target.constructor;
  }

  get prototype_() {
    return Object.getPrototypeOf(this.target);
  }

  getConstructorMetadata<T>(key: string): T | undefined {
    return this.getMetadata(this.constructor_, key);
  }

  setConstructorMetadata<T>(key: string, value: T): T {
    return this.setMetadata(this.constructor_, key, value);
  }

  getSelfMetadata<T>(key: string): T | undefined {
    return this.getMetadata(this.self_, key);
  }

  setSelfMetadata<T>(key: string, value: T): T {
    return this.setMetadata(this.self_, key, value);
  }

  getSelfPropertyMetadata<T>(propertyKey: string, key: string) {
    return this.getPropertyMetadata<T>(key, propertyKey);
  }

  setSelfPropertyMetadata<T>(propertyKey: string, key: string, value: T): T {
    this.setPropertyMetadata(key, propertyKey, value);
    return value;
  }

  get allPrototypeMetadata() {
    return this.getAllMetadata(this.prototype_);
  }

  get allConstructorMetadata() {
    return this.getAllMetadata(this.constructor_);
  }

  get allOwnMetadata() {
    return this.getAllMetadata(this.self_);
  }

  str(object: Record<string, any>) {
    const es = Object.entries(object).map(([k, v]) => [k, v instanceof Set ? Array.from(v) : v.toString()]);
    return Object.fromEntries(es);
  }

  show() {
    const content = `[${this.self_.toString()}]    
* [constructor]
${JSON.stringify(this.str(this.allConstructorMetadata))}

* [prototype]
${JSON.stringify(this.str(this.allPrototypeMetadata))}

* [own]
${JSON.stringify(this.str(this.allOwnMetadata))}
`;
    console.log(content);
  }
}
