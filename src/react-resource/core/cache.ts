import stringify from "fast-json-stable-stringify";
import { Resource } from "./resource";

import type { Mapping, FetcherReturnType, Fetcher } from "../types";

type Action<T extends Record<string, Fetcher>> =
  | {
      type: "get";
      payload: {
        [K in keyof T]: { key: K; args: Parameters<T[K]> };
      }[keyof T];
    }
  | {
      type: "reset";
      payload: {
        [K in keyof T]: { key: K; args?: Parameters<T[K]> };
      }[keyof T];
    }
  | {
      type: "clear";
    };

type Subscriber<T extends Record<string, Fetcher>> = (action: Action<T>) => void;

export interface CacheStore<T extends Record<string, Fetcher>> {
  get<K extends keyof T>(key: K, ...input: Parameters<T[K]>): ReturnType<T[K]> extends Promise<infer U> ? U : never;
  reset<K extends keyof T>(key: K, input?: Parameters<T[K]>): void;
  clear(): void;
  getStore(): {
    [K in keyof T]: Resource<FetcherReturnType<T[K]>, Parameters<T[K]>>;
  };
  subscribe(callback: Subscriber<T>): { unsubscribe: () => void };
}
export function createReactResource<T extends Record<string, Fetcher>>(resources: T): CacheStore<Mapping<T>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cacheMap = new Map<string, Resource<any, unknown[]>>();
  const subscribeMap = new Map<symbol, Subscriber<T>>();
  const generateKey = (key: string, input: unknown) => `${key}__${stringify(input)}`;

  const runSubscribers = (action: Action<T>) => {
    subscribeMap.forEach((callback) => {
      callback(action);
    });
  };

  return {
    get<K extends keyof T>(key: K & string, ...input: Parameters<T[K]>): FetcherReturnType<T[K]> {
      const acc = generateKey(key, input);
      const result = cacheMap.get(acc) ?? new Resource(resources[key]);
      cacheMap.set(acc, result);

      result.resolve(...input);
      runSubscribers({ type: "get", payload: { key, args: input } });

      return result.getData();
    },
    reset<K extends keyof T>(key: K & string, input?: Parameters<T[K]>): void {
      if (!input) {
        cacheMap.forEach((value) => {
          value.reset();
        });
        runSubscribers({ type: "reset", payload: { key } });
      } else {
        cacheMap.get(generateKey(key, input))?.reset();
        runSubscribers({ type: "reset", payload: { key, args: input } });
      }
    },
    clear() {
      cacheMap.clear();
      runSubscribers({ type: "clear" });
    },
    getStore() {
      const o = {} as ReturnType<CacheStore<T>["getStore"]>;
      cacheMap.forEach((value, key: keyof T) => {
        o[key] = value;
      });

      return o;
    },
    subscribe(callback: Subscriber<T>) {
      const id = Symbol();
      subscribeMap.set(id, callback);

      return {
        unsubscribe() {
          subscribeMap.delete(id);
        }
      };
    }
  };
}
