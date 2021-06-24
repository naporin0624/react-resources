/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useReducer, useContext, useRef, useEffect } from "react";
import { context } from "../core/context";
import { Resource as CoreResource } from "../core/resource";

import type { Resources } from "../index";
import type { FetcherReturnType } from "../types";

interface ReactResource<T, Args extends unknown[]> {
  read(...args: Args): T;
  reset(): void;
}
type Resource = {
  [K in keyof Resources]: ReactResource<FetcherReturnType<Resources[K]>, Parameters<Resources[K]>>;
};

export const useResource = () => {
  const store = useContext(context);
  const ref = useRef<CoreResource<any, any> | null>(null);
  const [, force] = useReducer((s: number) => s + 1, 0);

  useEffect(() => {
    const s = ref.current?.subscribe((status) => {
      switch (status.type) {
        case "wait": {
          force();
          break;
        }
      }
    });
    return () => {
      s?.unsubscribe();
    };
  }, [store]);

  return new Proxy({} as Resource, {
    get<K extends keyof Resource>(_: unknown, key: K) {
      const read = (...args: unknown[]) => {
        // @ts-ignore
        const resource = store[key].get(...args);
        ref.current = resource;
        const { status } = resource;
        switch (status.type) {
          case "success":
            return status.payload;
          default:
            // @ts-ignore
            resource.resolve(...args);
            throw status.payload;
        }
      };
      const reset = () => store[key].clear();

      return { read, reset };
    }
  });
};
