import { useContext, useEffect, useRef, useReducer } from "react";
import { Mapping, FetcherReturnType } from "../types";
import { context } from "../core/context";

import type { Resources } from "../index";

interface ReactResource<T, Args extends unknown[]> {
  read(...args: Args): T;
  reset(): void;
}
type UseResource = {
  [K in keyof Resources]: ReactResource<FetcherReturnType<Resources[K]>, Parameters<Resources[K]>>;
};

export const useResource = () => {
  const store = useContext(context);
  const [, force] = useReducer((s) => s + 1, 0);
  const keyRef = useRef("");

  useEffect(() => {
    const subscription = store.subscribe((cache) => {
      switch (cache.type) {
        case "clear": {
          force();
          break;
        }
        case "reset": {
          const { key } = cache.payload;
          if (key == keyRef.current) force();
          break;
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [store]);

  return new Proxy({} as UseResource, {
    get<K extends keyof UseResource>(_: unknown, key: K) {
      keyRef.current = key;
      const read = (...args: Parameters<Mapping<Resources>[K]>) => store.get(key, ...args);
      const reset = () => store.reset(key);

      return { read, reset };
    }
  });
};
