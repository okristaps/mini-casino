import { observer } from "mobx-react";
import { useEffect } from "react";
import { useWebSocketContext } from "@contexts/index";

const WebSocketComponent = observer(() => {
  const { store } = useWebSocketContext();

  const { settings } = store;
  console.log("settings", settings.betLimits);

  const sendStartGame = () => {
    const message = {
      type: "startGame",
    };
    store.sendWebSocketMessage(JSON.stringify(message));
  };

  const sendPlaceBet = (betSpot: string, amount: number) => {
    const message = {
      type: "placeBet",
      action: {
        [betSpot]: amount,
      },
    };
    store.sendWebSocketMessage(JSON.stringify(message));
  };

  return (
    <div className="basic">
      <h2>WebSocket Messages:</h2>
      <ul>
        {store?.messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
});

export default WebSocketComponent;
