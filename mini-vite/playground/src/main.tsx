import React from "react";
import ReactDOM from "react-dom";
// import App from "./App";
import "./index.css";

const App = () => <div>hello liuxing</div>;

ReactDOM.render(<App />, document.getElementById("root"));

// @ts-ignore
import.meta.hot.accept(() => {
  ReactDOM.render(<App />, document.getElementById("root"));
});