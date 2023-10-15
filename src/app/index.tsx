import Grid from "@components/grid/grid";
import WebSocketComponent from "@components/webSocketComponent";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useWebSocketContext } from "./context";
import { Phases } from "@types";
import { BetOptions, Info } from "./components";

const App = observer(() => {
  const { store } = useWebSocketContext();

  const {
    selectedCells,
    selectedBet,
    setSelectedBet,
    lastPayout,
    multipliers,
    phase,
    previousCells,
    balance,
  } = store;

  console.log("multipliers", multipliers);

  useEffect(() => {
    store.connectWebSocket();
    return () => {
      store.disconnectWebSocket();
    };
  }, [store]);

  const betOptions: number[] = [0.1, 0.5, 1, 2, 5, 10, 25, 100, 500];
  const betsDisabled = phase !== Phases.betsOpen || balance < selectedBet || balance === 0;

  const handleCellClick = async (cellKey: string) =>
    await store
      .sendWebSocketMessage(
        JSON.stringify({
          type: "placeBet",
          action: {
            [cellKey]: selectedBet,
          },
        })
      )
      .then(() => {
        store.handleBet(cellKey, selectedBet);
      })
      .catch((err) => console.log("error", err));

  const sendStartGame = async () =>
    await store
      .sendWebSocketMessage(JSON.stringify({ type: "startGame" }))
      .then(() => store.setPreviousBets());

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div>
        <BetOptions
          balance={balance}
          betOptions={betOptions}
          selectedBet={selectedBet}
          handleBetSelection={(bet: number) => store.setSelectedBet(bet)}
        />
        <button onClick={sendStartGame}>Start Game</button>
        <Grid
          betsDisabled={betsDisabled}
          phase={phase}
          multipliers={multipliers}
          selectedCells={selectedCells}
          size={5}
          onCellClick={handleCellClick}
        />
        <WebSocketComponent />
      </div>
      <Info {...store} />
    </div>
  );
});

export default App;
