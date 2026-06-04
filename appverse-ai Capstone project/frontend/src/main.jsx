import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./App";

const savedTheme = localStorage.getItem("theme");
const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)").matches;
const initialTheme = savedTheme || (prefersLight ? "light" : "dark");
document.documentElement.classList.toggle("light", initialTheme === "light");
document.documentElement.classList.toggle("dark", initialTheme !== "light");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
