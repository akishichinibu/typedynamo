export * from './metadata.manager';
export * from './prototype.chain';
export * from './type.utilities';

export const prettyJSON = (r: any) => JSON.stringify(r, null, 2);

export const now = () => new Date().toISOString();
export const nowTimestamp = () => Math.floor(new Date().getTime() / 1000);
export const empty = () => undefined;
