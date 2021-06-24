import React, { FC, memo, useMemo } from "react";
import { context } from "../core/context";
import { createReactResource } from "../core/cache";
import { Mapping } from "../types";
import { Resources } from "../index";

type Props = {
  resources: Mapping<Resources>;
};
export const Provider: FC<Props> = ({ children, resources }) => {
  const store = useMemo(() => createReactResource(resources), [resources]);

  return <context.Provider value={store}>{children}</context.Provider>;
};

export default memo(Provider);
