import ReactDOM from "react-dom/client";
import App from "./app/App";
import "./index.css";
import { Provider } from "mobx-react";
import store from "./app/stores/store";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
