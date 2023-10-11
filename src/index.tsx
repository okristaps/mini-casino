import ReactDOM from "react-dom/client";
import App from "./app/App";
import { WebSocketProvider } from "./app/context/context";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <WebSocketProvider>
    <App />
  </WebSocketProvider>
);
