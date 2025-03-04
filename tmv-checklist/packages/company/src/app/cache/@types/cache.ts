type CacheOptionSchema = {
  temporal: { ttl: number; paramIndex?: number[] };
  persistent: {
    refreshIntervalSec?: number;
  };
  bust: { paramIndex?: number[] };
};
export const enum INTERNAL_KIND {
  PERSISTENT = 0,
  TEMPORAL = 1,
  BUST = 2,
}

export type CacheStorage = {
  store?: ICacheStorage;
};

export type CacheKind = 'persistent' | 'temporal' | 'bust';
export type CacheOptions<Kind extends CacheKind> = CacheOptionSchema[Kind] & {
  key: string;
  kind: Kind;
} & CacheStorage;
export interface ICacheStorage {
  get(key: string): any;
  set(key: string, value: any): any;
  delete(key: string): boolean | Promise<boolean>;
  has(key: string): boolean | Promise<boolean>;
}
