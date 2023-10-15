import { BetOptions, Grid, Info, ListMessagesComponent } from "@components/index";
import { useWebSocketContext } from "@contexts/index";
import { Phases } from "@types";
import { observer } from "mobx-react";
import { useEffect } from "react";

const App = observer(() => {
  const { store } = useWebSocketContext();
  const { selectedCells, betAmount, multipliers, phase, balance, settings } = store;
  const betsDisabled = phase !== Phases.betsOpen || balance < betAmount || balance === 0;

  useEffect(() => {
    store.connectWebSocket();
    return () => {
      store.disconnectWebSocket();
    };
  }, [store]);

  const handleCellClick = async (cellKey: string) =>
    await store
      .sendWebSocketMessage(
        JSON.stringify({
          type: "placeBet",
          action: {
            [cellKey]: betAmount,
          },
        })
      )
      .then(() => {
        store.handleBet(cellKey, betAmount);
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
          betOptions={settings.chips}
          betAmount={betAmount}
          handleBetSelection={(bet: number) => store.setBetAmount(bet)}
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
        <ListMessagesComponent />
      </div>
      <Info {...store} />
    </div>
  );
});

export default App;
