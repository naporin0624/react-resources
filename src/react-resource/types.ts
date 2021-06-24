export type Status<T> =
  | {
      type: "pending";
      payload: Promise<T>;
    }
  | {
      type: "success";
      payload: T;
    }
  | {
      type: "error";
      payload: Error;
    }
  | {
      type: "wait";
      payload: Promise<void>;
    };
export type Mapping<T> = {
  [K in keyof T]: T[K];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Fetcher = (...args: any[]) => Promise<any>;

export type FetcherReturnType<T extends Fetcher> = ReturnType<T> extends Promise<infer U> ? U : never;
