import { observer } from "mobx-react";
import { useEffect } from "react";
import store from "./stores/store";

const WebSocketComponent = observer(() => {
  useEffect(() => {
    store.connectWebSocket();

    return () => {
      store.disconnectWebSocket();
    };
  }, []);

  return (
    <div>
      <h2>Stuff:</h2>
      <ul>
        {store.messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
});

export default WebSocketComponent;
