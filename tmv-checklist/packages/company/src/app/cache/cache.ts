import { SetMetadata } from '@nestjs/common';
import { EventEmitter } from 'events';
import { CACHE } from './constants';
import { CacheKind, CacheOptions, INTERNAL_KIND } from './@types';
import { isBust, isPersistent, isTemporal } from './guard';
import 'reflect-metadata';

export const cacheEventEmitter = new EventEmitter();
export const intervalTimerMap = new Map<string, boolean>();

export const makeParamBasedCacheKey = (
  key: string,
  args: any[],
  paramIndex: number[] | undefined,
) =>
  !paramIndex
    ? key
    : paramIndex.reduce(
        (cacheKey, pidx) =>
          `${cacheKey}:${Buffer.from(JSON.stringify(args[pidx])).toString(
            'base64',
          )}`,
        key,
      );

function copyOriginalMetadataToCacheDescriptor(
  metadataKeys: any[],
  originalMethod: any,
  descriptor: PropertyDescriptor,
) {
  metadataKeys.forEach((key) => {
    const metadataValue = Reflect.getMetadata(key, originalMethod);
    Reflect.defineMetadata(key, metadataValue, descriptor.value);
  });
}

export const Cache = <Kind extends CacheKind>(
  cacheOptions: CacheOptions<Kind>,
) => {
  return (
    target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;
    const originalMethodMetadataKeys = Reflect.getMetadataKeys(originalMethod);
    const { key } = cacheOptions;

    if (isPersistent(cacheOptions)) {
      const { refreshIntervalSec } = cacheOptions;

      Reflect.defineMetadata(key, INTERNAL_KIND.PERSISTENT, target);

      descriptor.value = async function () {
        if (arguments.length)
          throw new Error('arguments are not supported for persistent cache');
        const store = descriptor.value.cacheStore;
        if (await store.has(key)) return store.get(key);

        const result = await originalMethod.call(this);
        store.set(key, result);

        if (refreshIntervalSec && !intervalTimerMap.has(key)) {
          setInterval(() => {
            const result = originalMethod.call(this);

            result instanceof Promise
              ? result.then((result) => {
                  store.set(key, result);
                })
              : store.set(key, result);
          }, refreshIntervalSec * 1000);

          intervalTimerMap.set(key, true);
        }

        return result;
      };

      cacheEventEmitter.once(key, (instance) => {
        descriptor.value.call(instance);

        cacheEventEmitter.on(`__${INTERNAL_KIND.PERSISTENT}=>${key}__`, () => {
          descriptor.value.call(instance);
        });
      });
    }

    if (isTemporal(cacheOptions)) {
      const { ttl, paramIndex } = cacheOptions;

      Reflect.defineMetadata(key, INTERNAL_KIND.TEMPORAL, target);

      descriptor.value = async function (...args: any[]) {
        const store = descriptor.value.cacheStore;
        const cacheKey = makeParamBasedCacheKey(key, args, paramIndex);
        console.log('cacheOptions: ', cacheOptions);
        console.log(
          'cacheKey: ',
          cacheKey,
          ' HIT: ',
          await store.has(cacheKey),
        );

        if (await store.has(cacheKey)) return store.get(cacheKey);

        const result = await originalMethod.apply(this, args);

        store.set(cacheKey, result);

        setTimeout(() => {
          store.delete(cacheKey);
        }, ttl * 1000);

        return result;
      };
    }

    if (isBust(cacheOptions)) {
      descriptor.value = async function (...args: any[]) {
        const store = descriptor.value.cacheStore;
        const { paramIndex } = cacheOptions;
        const cacheKey = makeParamBasedCacheKey(key, args, paramIndex);

        await store.delete(cacheKey);

        const result = await originalMethod.apply(this, args);

        if (Reflect.getMetadata(key, target) === INTERNAL_KIND.PERSISTENT) {
          cacheEventEmitter.emit(`__${INTERNAL_KIND.PERSISTENT}=>${key}__`);
        }

        return result;
      };
    }
    copyOriginalMetadataToCacheDescriptor(
      originalMethodMetadataKeys,
      originalMethod,
      descriptor,
    );

    SetMetadata(CACHE, cacheOptions)(descriptor.value);

    return descriptor;
  };
};
