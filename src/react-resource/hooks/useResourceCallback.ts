import { useContext } from "react";
import { context } from "../core/context";

import type { Resources } from "../index";

export const useResourceCallback = (): Resources => {
  const store = useContext(context);

  return new Proxy({} as Resources, {
    get<K extends keyof Resources>(_: Resources, key: K) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (...args: any[]) => {
        const resource = store.get();
        console.log(store.getStore(), resource);
        resource.resolve(...args);

        let subscription: null | { unsubscribe: () => void } = null;
        return new Promise((resolve, reject) => {
          subscription = resource.subscribe((action) => {
            switch (action.type) {
              case "error": {
                return reject(action.payload);
              }
              case "success": {
                return resolve(action.payload);
              }
            }
          });
        }).finally(() => {
          subscription?.unsubscribe();
        });
      };
    }
  });
};
