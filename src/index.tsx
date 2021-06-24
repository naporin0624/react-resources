import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { render } from "react-dom";

import { ResourceProvider } from "./react-resource";
import { timer } from "./resource/timer";
import { todos, todo } from "./resource/todo";

import App from "./App";
import { FallbackComponent } from "./FallbackComponent";

declare module "react" {
  function memo<T>(component: T): T;
}

declare module "./react-resource" {
  interface Resources {
    timer: typeof timer;
    todos: typeof todos;
    todo: typeof todo;
  }
}

const rootElement = document.getElementById("root");
render(
  <ResourceProvider resources={{ timer, todos, todo }}>
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <Suspense fallback={"loading"}>
        <App />
      </Suspense>
    </ErrorBoundary>
  </ResourceProvider>,
  rootElement
);
