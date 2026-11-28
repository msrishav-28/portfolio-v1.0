import React from "react";
import { hydrateRoot } from "react-dom/client";
import { attributesToProps } from "html-react-parser";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("The application root element was not found.");
}

const markup = rootElement.innerHTML;

// Match React's hydration representation; App refs retain the source strings.
for (const element of rootElement.querySelectorAll("[style]")) {
  const { style } = attributesToProps({
    style: element.getAttribute("style") ?? "",
  });
  if (!style) continue;

  const serialized = Object.entries(style)
    .map(([name, value]) => {
      const property = name.startsWith("--")
        ? name
        : name
            .replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
            .replace(/^ms-/, "-ms-");
      return `${property}:${String(value).trim()}`;
    })
    .join(";");
  element.setAttribute("style", serialized);
}

hydrateRoot(
  rootElement,
  <React.StrictMode>
    <App markup={markup} />
  </React.StrictMode>,
);
