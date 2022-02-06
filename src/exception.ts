export class IndexDefinitionError extends Error {
  constructor(Entity: any, message: string) {
    super(`[${Entity.name}] ${message}`);
  }
}

export class PrimaryIndexDefinitionError extends Error {
  constructor(EntityPrototype: any, message: string) {
    super(`[${EntityPrototype.name}] ${message}`);
  }
}

export class ObjectNotFoundError extends Error {
  constructor(message?: string) {
    super(message);
  }
}
