import {
  BetOptions,
  Controls,
  ErrorModal,
  Grid,
  Header,
  Info,
  ListMessagesComponent,
} from "@components/index";
import { useWebSocketContext } from "@contexts/index";
import { Phases } from "@types";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { levels } from "./constants";

const Game = observer(() => {
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
      .catch((err) => store.setError(err));

  const handleHeader = () => store.doWeirdStuff();

  return (
    <>
      <ErrorModal error={store.error} onClose={() => store.setError("")} />
      <div className="content-wrapper">
        <div className="left-container">
          <Header phase={phase} handleClick={handleHeader} />
          <Info {...store}>
            <BetOptions />
            <Controls />
          </Info>
        </div>
        <div className="game-container">
          <Grid
            cheatsEnabled={store.cheatSettings.cheatsEnabled}
            betAmount={betAmount}
            settings={settings}
            betsDisabled={betsDisabled}
            phase={phase}
            multipliers={multipliers}
            selectedCells={selectedCells}
            size={levels[store.levelSettings.selectedLevel].grid}
            onCellClick={handleCellClick}
          />
        </div>
      </div>
      <ListMessagesComponent />
    </>
  );
});

export default Game;
