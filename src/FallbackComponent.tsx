import React, { VFC } from "react";
import { FallbackProps } from "react-error-boundary";

export const FallbackComponent: VFC<FallbackProps> = ({ resetErrorBoundary, error }) => {
  return (
    <div>
      <p>{JSON.stringify(error)}</p>
      <button onClick={resetErrorBoundary}>reset</button>
    </div>
  );
};
