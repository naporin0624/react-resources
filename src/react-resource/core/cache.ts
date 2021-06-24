/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */

import stringify from "fast-json-stable-stringify";
import { Fetcher, FetcherReturnType } from "../types";
import { Resource } from "./resource";

interface Cache<T extends Fetcher> {
  get(...args: Parameters<T>): Resource<FetcherReturnType<T>, Parameters<T>>;
  clear(): void;
}

type CacheMap<T extends Record<string, Fetcher>> = {
  [K in keyof T]: Map<string, Resource<FetcherReturnType<T[K]>, Parameters<T[K]>>>;
};
type CacheStore<T extends Record<string, Fetcher>> = {
  [K in keyof T]: Cache<T[K]>;
};
export type ResourceCache<T extends Record<string, Fetcher>> = CacheStore<T> & {
  clear(): void;
};

const get = () => {
  /* */
};
const clear = () => {
  /* */
};

export const createResourceCache = <T extends Record<string, Fetcher>>(fetchers: T): ResourceCache<T> => {
  const cacheMap = {} as CacheMap<T>;
  const mock = Object.keys(fetchers)
    .map((key) => ({ [key]: get, clear }))
    .reduce((acc, value) => ({ ...acc, ...value }), {}) as CacheStore<T>;

  const cache = new Proxy(mock, {
    get<K extends keyof T>(_: CacheStore<T>, key: K & string): Cache<T[K]> {
      if (!cacheMap[key]) cacheMap[key] = new Map<string, Resource<any, any>>();
      const cache = cacheMap[key];

      return {
        get(...args: Parameters<T[K]>) {
          const acc = `${key}__${stringify(args)}`;
          if (cache.has(acc)) {
            return cache.get(acc)!;
          }

          const resource = new Resource(fetchers[key]);
          cache.set(acc, resource);
          return resource;
        },
        clear() {
          cache.forEach((value) => {
            value.reset();
          });
        }
      };
    }
  });
  return {
    ...cache,
    clear() {
      Object.keys(cacheMap).forEach((key) => {
        cache[key].clear();
      });
    }
  };
};
