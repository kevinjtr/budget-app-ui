import React from "react";
import ReactDOM from "react-dom";
import getStore from "./bundles";
import cache from "./utils/cache";

import App from "./App";
import * as serviceWorker from "./serviceWorker";

import "./css/coreui/style.css";
import "./css/loader.css";
import "./css/index.css";

cache.getAll().then(initialData => {
  const store = getStore(initialData);

  window.store = store;

  ReactDOM.render(<App store={store} />, document.getElementById("root"));
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();