import { Suspense } from "react";
import { useResource, useClearResource } from "./react-resource";

const DelaySample = ({ timeout }: { timeout: number }) => {
  const { reset, read } = useResource().timer;
  const ms = read(timeout);
  const onClick = () => {
    reset();
  };
  return (
    <div>
      <h2>timer</h2>
      <div style={{ display: "flex", gap: 10 }}>
        <span>timeout: {ms}</span>
        <button onClick={onClick}>reset</button>
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
      {/* <Suspense fallback={<p>sample2 fallback</p>}>
        <DelaySample timeout={2000} />
      </Suspense>
      <Suspense fallback={<p>todo fallback</p>}>
        <TodoSample id={1} />
      </Suspense> */}
    </div>
  );
}
