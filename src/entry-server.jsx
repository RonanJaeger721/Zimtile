import React from "react";
import { renderToString } from "react-dom/server";
import App, { routePaths, metadata } from "./App.jsx";
export { routePaths, metadata };
export function render(path) {
  return renderToString(<App initialPath={path} />);
}
