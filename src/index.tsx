import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { render } from "react-dom";

import { ResourceProvider, Resources } from "./react-resource";
import { timer } from "./resource/timer";
import { getTodo, Todo } from "./resource/todo";

import App from "./App";
import { FallbackComponent } from "./FallbackComponent";

declare module "react" {
  function memo<T>(component: T): T;
}

declare module "./react-resource" {
  interface Resources {
    timer: typeof timer;
    todos: () => Promise<Todo[]>;
    todo: (id: number) => Promise<Todo>;
  }
}

const resources: Resources = {
  timer,
  todos: () => getTodo.execute(),
  todo: (id: number) => getTodo.execute(id)
};

const rootElement = document.getElementById("root");
render(
  <ResourceProvider resources={resources}>
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <Suspense fallback={"loading"}>
        <App />
      </Suspense>
    </ErrorBoundary>
  </ResourceProvider>,
  rootElement
);
