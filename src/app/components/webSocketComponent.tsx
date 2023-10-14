import { observer } from "mobx-react";
import { useEffect } from "react";
import { useWebSocketContext } from "@contexts/index";

const WebSocketComponent = observer(() => {
  const { store } = useWebSocketContext();

  const { settings } = store;
  console.log("settings", settings.betLimits);

  useEffect(() => {
    store.connectWebSocket();
    return () => {
      store.disconnectWebSocket();
    };
  }, [store]);

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

      <button
        onClick={() => {
          sendStartGame();
        }}
      >
        Start game
      </button>

      <button
        onClick={() => {
          sendPlaceBet("A1", 0.5);
        }}
      >
        Place bet A1 0.5
      </button>

      <button
        onClick={() => {
          sendPlaceBet("T20", 500);
        }}
      >
        Place bet T20 500
      </button>
    </div>
  );
});

export default WebSocketComponent;
