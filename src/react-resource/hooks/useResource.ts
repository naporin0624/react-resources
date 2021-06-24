import { useContext, useEffect, useRef, useReducer } from "react";
import { Mapping, FetcherReturnType } from "../types";
import { Resources, context } from "../index";

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
          const { key, args } = cache.payload;
          if (key !== keyRef.current) return;
          if (!args) force();

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
      function read() {
        const args = (arguments as unknown) as Parameters<Mapping<Resources>[K]>;
        return store.get(key, ...args);
      }
      function reset() {
        store.reset(key);
      }

      return { read, reset };
    }
  });
};
