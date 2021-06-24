import { createContext, FC, memo, useMemo } from "react";
import { CacheStore, createReactResource } from "./core/cache";

import type { Mapping } from "./types";

export { useResource } from "./hooks/useResource";
export { useStore } from "./hooks/useStore";
export { useClearResource } from "./hooks/useClearResource";

export interface Resources {}

export const context = createContext<CacheStore<Mapping<Resources>>>(
  (null as unknown) as CacheStore<Mapping<Resources>>
);

type Props = {
  resources: Mapping<Resources>;
};
const Provider: FC<Props> = ({ children, resources }) => {
  const store = useMemo(() => createReactResource(resources), [resources]);

  return <context.Provider value={store}>{children}</context.Provider>;
};

export const ResourceProvider = memo(Provider);
