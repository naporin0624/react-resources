import { createContext } from "react";

import type { ResourceCache } from "./cache";
import type { Mapping } from "../types";
import type { Resources } from "../index";

type Value = ResourceCache<Mapping<Resources>>;
export const context = createContext<Value>({} as Value);
