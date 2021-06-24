export type Status<T> =
  | {
      type: "pending";
      payload?: never;
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
      payload?: never;
    };

export type Mapping<T> = {
  [K in keyof T]: T[K];
};

export type Fetcher = (...args: any[]) => Promise<any>;

export type FetcherReturnType<T extends Fetcher> = ReturnType<T> extends Promise<infer U> ? U : never;
