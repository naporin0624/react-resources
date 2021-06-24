import { useContext, useCallback } from "react";
import { context } from "../index";

export const useClearResource = () => {
  const store = useContext(context);

  return useCallback(() => {
    store.clear();
  }, [store]);
};
