import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.jsx";
import "./style.css";
const el = document.getElementById("root");
if (el.children.length)
  hydrateRoot(el, <App initialPath={location.pathname} />);
else createRoot(el).render(<App initialPath={location.pathname} />);
