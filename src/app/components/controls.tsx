import { parseCellsToAction } from "@app/helpers";
import { useWebSocketContext } from "@contexts/context";
import { Phases } from "@types";
import { observer } from "mobx-react";
import React from "react";

const Controls: React.FC = observer(() => {
  const { store } = useWebSocketContext();

  const { selectedCells, balance, betSum, previousBetInfo, phase } = store;

  const repeatDisbled =
    previousBetInfo.repeatEnabled ||
    !previousBetInfo.selectedCells.length ||
    previousBetInfo.betSum > balance ||
    phase !== Phases.betsOpen;

  const handleRepeat = async () =>
    await store
      .sendWebSocketMessage(
        JSON.stringify({
          type: "placeBet",
          action: parseCellsToAction(previousBetInfo.selectedCells),
        })
      )
      .then(() => {
        store.repeatPreviousBets();
      })
      .catch((err) => store.setError(err));

  const handleStartGame = async () =>
    await store
      .sendWebSocketMessage(JSON.stringify({ type: "startGame" }))
      .then(() => store.setPreviousBets())
      .catch((err) => store.setError(err));

  // for some reason the server isnt taking the negative bet and the undo doesnt work properly please let me know if its a mistake on my end
  const handleUndoBets = async () =>
    await store
      .sendWebSocketMessage(
        JSON.stringify({
          type: "placeBet",
          action: { [selectedCells[selectedCells.length - 1].cellKey]: -1 },
        })
      )
      .then(() => store.undoLastBet())
      .catch((err) => store.setError(err));

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", flexDirection: "row", flex: 1, gap: 10, marginTop: 10 }}>
        <button
          className="custom-button"
          disabled={repeatDisbled}
          onClick={handleRepeat}
          style={{
            height: 50,
            flex: 1,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          }}
        >
          <span>Repeat</span>
        </button>
        <button
          className="custom-button"
          disabled={
            selectedCells.length === 0 || phase !== Phases.betsOpen || previousBetInfo.repeatEnabled
          }
          onClick={handleUndoBets}
          style={{
            height: 50,
            flex: 1,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          }}
        >
          <span>Undo</span>
        </button>
      </div>

      <button
        className="custom-button green-button"
        style={{
          display: "flex",
          height: 50,
          width: "100%",
          marginTop: 10,
        }}
        disabled={betSum === 0 || phase !== Phases.betsOpen}
        onClick={handleStartGame}
      >
        <span>Start Game</span>
      </button>
    </div>
  );
});

export default Controls;
