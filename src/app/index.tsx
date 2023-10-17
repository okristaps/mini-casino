import { BetOptions, Controls, Grid, Header, Info } from "@components/index";
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
    <div className="body">
      <Header phase={phase} />
      <div className="content-wrapper">
        <div className="left-container">
          <Info {...store}>
            <BetOptions />
            <Controls />
          </Info>
        </div>
        <div className="grid-container">
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
