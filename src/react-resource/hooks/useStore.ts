import { useContext, useMemo } from "react";
import { context } from "../core/context";

export const useStore = () => {
  const store = useContext(context);

  return useMemo(() => store.getStore(), [store]);
};
