import { createContext } from "react";
import { CacheStore } from "./cache";
import { Mapping } from "../types";
import { Resources } from "../index";

export const context = createContext<CacheStore<Mapping<Resources>>>(null as unknown as CacheStore<Mapping<Resources>>);
