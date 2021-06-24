import isPromise from "is-promise";
import type { Status } from "../types";

type Subscriber<T> = (status: Status<T>) => void;

export interface ReactResource<T, Args extends Array<unknown>> {
  resolve(...args: Args): void;
  getData(): T;
  subscribe(callback: Subscriber<T>): { unsubscribe(): void };
}

export class Resource<T, Args extends Array<unknown>> implements ReactResource<T, Args> {
  public status!: Status<T>;
  private fetcher: (...args: Args) => Promise<T>;

  private awaiter!: Promise<void>;
  private resolver!: () => void;
  private rejector!: () => void;

  private subscriber = new Map<symbol, Subscriber<T>>();

  constructor(args: Promise<T> | ((...args: Args) => Promise<T>)) {
    this.init();
    this.fetcher = isPromise(args) ? () => args : args;
  }
  subscribe(callback: (status: Status<T>) => void): { unsubscribe(): void } {
    const id = Symbol();
    this.subscriber.set(id, callback);

    return {
      unsubscribe: () => {
        this.subscriber.delete(id);
      }
    };
  }

  resolve(...args: Args) {
    if (this.status.type !== "wait") return;

    this.dispatch({ type: "pending" });
    this.fetcher(...args)
      .then((data) => {
        this.dispatch({ type: "success", payload: data });
        this.resolver();
      })
      .catch((error) => {
        this.dispatch({ type: "error", payload: error });
        this.rejector();
      });
  }

  reset() {
    this.init();
  }

  getData() {
    switch (this.status.type) {
      case "success": {
        return this.status.payload;
      }
      case "error": {
        throw this.status.payload;
      }
      default: {
        throw this.awaiter;
      }
    }
  }

  private init() {
    this.awaiter = new Promise<void>((resolve, reject) => {
      this.resolver = resolve;
      this.rejector = reject;
    });
    this.dispatch({ type: "wait" });
  }

  private dispatch(next: Status<T>) {
    this.status = next;
    this.subscriber.forEach((value) => {
      value(this.status);
    });
  }
}
