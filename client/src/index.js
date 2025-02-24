import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { LoadingBarContainer } from "react-top-loading-bar";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <LoadingBarContainer>
    <App />
  </LoadingBarContainer>
);

reportWebVitals();
