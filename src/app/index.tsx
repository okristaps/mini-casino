import { BetOptions, Grid, Info, ListMessagesComponent } from "@components/index";
import { useWebSocketContext } from "@contexts/index";
import { Phases } from "@types";
import { observer } from "mobx-react";
import { useEffect } from "react";

const App = observer(() => {
  const { store } = useWebSocketContext();
  const {
    selectedCells,
    betAmount,
    multipliers,
    phase,
    balance,
    settings,
    betSum,
    previousBetInfo,
  } = store;
  const betsDisabled = phase !== Phases.betsOpen || balance < betAmount || balance === 0;
  // const repeatDisabled = !repeatEnabled ||

  useEffect(() => {
    store.connectWebSocket();
    return () => {
      store.disconnectWebSocket();
    };
  }, [store]);

  useEffect(() => {
    if (betAmount > balance) {
      store.setBetAmount(settings.chips[0]);
    }
  }, [betAmount, balance]);

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

  const handleRepeat = async () => {
    const action: { [key: string]: number } = {};

    for (const item of previousBetInfo.selectedCells) {
      if (item?.cellKey) {
        action[item.cellKey] = item.bet;
      }
    }

    return await store
      .sendWebSocketMessage(
        JSON.stringify({
          type: "placeBet",
          action,
        })
      )
      .then(() => {
        store.repeatPreviousBets();
      })
      .catch((err) => console.log("error", err));
  };

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

        {phase === Phases.betsOpen && (
          <button disabled={betSum === 0} onClick={sendStartGame}>
            Start Game
          </button>
        )}

        {phase === Phases.betsOpen && Boolean(previousBetInfo?.selectedCells?.length) && (
          <button
            disabled={
              previousBetInfo.repeatEnabled ||
              selectedCells.length ||
              previousBetInfo.betSum > balance
            }
            onClick={handleRepeat}
          >
            Repeat
          </button>
        )}

        <Grid
          betAmount={betAmount}
          settings={settings}
          betsDisabled={betsDisabled || previousBetInfo.repeatEnabled}
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
