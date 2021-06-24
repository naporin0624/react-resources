import { useContext, useMemo } from "react";
import { context } from "../index";

export const useStore = () => {
  const store = useContext(context);

  return useMemo(() => store.getStore(), [store]);
};
