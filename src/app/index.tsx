import { BetOptions, Grid, Info } from "@components/index";
import { useWebSocketContext } from "@contexts/index";
import { Phases } from "@types";
import { observer } from "mobx-react";
import { useEffect } from "react";

const App = observer(() => {
  const { store } = useWebSocketContext();
  const { selectedCells, betAmount, multipliers, phase, balance, settings, previousBetInfo } =
    store;

  const betsDisabled =
    phase !== Phases.betsOpen ||
    balance < betAmount ||
    balance === 0 ||
    betAmount < settings.chips[0] ||
    previousBetInfo.repeatEnabled;

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
  }, [betAmount, balance, settings, store]);

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

  return (
    <div className="root">
      <div style={{ textAlign: "center" }}>
        <h1 style={{ color: "white" }}> {phase} </h1>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
        }}
      >
        <div
          style={{
            height: "100%",
            width: 300,
            paddingRight: 20,
            paddingLeft: 20,
          }}
        >
          <Info {...store}>
            <BetOptions
              balance={balance}
              betOptions={settings.chips}
              betAmount={betAmount}
              handleBetSelection={(bet: number) => store.setBetAmount(bet)}
            />
          </Info>
        </div>
        <div
          style={{
            display: "flex",
            flex: 1,
            width: "100%",
            backgroundColor: "#0f212f",
            padding: 20,
          }}
        >
          <Grid
            betAmount={betAmount}
            settings={settings}
            betsDisabled={betsDisabled}
            phase={phase}
            multipliers={multipliers}
            selectedCells={selectedCells}
            size={5}
            onCellClick={handleCellClick}
          />
        </div>
      </div>
    </div>
  );
});

export default App;
