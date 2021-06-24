import { useContext, useCallback } from "react";
import { context } from "../core/context";

export const useClearResource = () => {
  const store = useContext(context);

  return useCallback(() => {
    store.clear();
  }, [store]);
};
