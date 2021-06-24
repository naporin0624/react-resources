import React, { Suspense, useState } from "react";
import { useResource, useClearResource } from "./react-resource";
import { useResourceCallback } from "./react-resource/hooks/useResourceCallback";

const DelaySample = ({ timeout }: { timeout: number }) => {
  const { reset, read } = useResource().timer;
  const execute = useResourceCallback().timer;
  const [ms, setMs] = useState(read(timeout));
  const onClick = () => {
    reset();
  };
  const e = async () => {
    setMs(await execute(5000));
  };

  return (
    <div>
      <h2>timer</h2>
      <div style={{ display: "flex", gap: 10 }}>
        <span>timeout: {ms}</span>
        <button onClick={onClick}>reset</button>
        <button onClick={e}>click</button>
      </div>
    </div>
  );
};

const TodoSample = ({ id }: { id: number }) => {
  const todo = useResource().todo.read(id);

  return (
    <div>
      <h2>todo</h2>
      <div key={JSON.stringify(todo)}>{todo.title}</div>
    </div>
  );
};

export default function App() {
  const resetAll = useClearResource();

  return (
    <div>
      <button onClick={resetAll}>resetAll</button>
      <Suspense fallback={<p>sample1 fallback</p>}>
        <DelaySample timeout={1000} />
      </Suspense>
      <Suspense fallback={<p>sample1 fallback</p>}>
        <DelaySample timeout={1000} />
      </Suspense>
      <Suspense fallback={<p>sample2 fallback</p>}>
        <DelaySample timeout={2000} />
      </Suspense>
      <Suspense fallback={<p>todo fallback</p>}>
        <TodoSample id={1} />
        <TodoSample id={1} />
        <TodoSample id={1} />
        <TodoSample id={1} />
        <TodoSample id={1} />
        <TodoSample id={1} />
      </Suspense>
    </div>
  );
}
