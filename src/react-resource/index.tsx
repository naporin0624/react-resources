export { useResource } from "./hooks/useResource";
export { useStore } from "./hooks/useStore";
export { useClearResource } from "./hooks/useClearResource";
import Provider from "./components/Provider";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Resources {}

export const ResourceProvider = Provider;
