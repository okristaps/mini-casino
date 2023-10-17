import { parseCellsToAction } from "@app/helpers";
import { useWebSocketContext } from "@contexts/context";
import { observer } from "mobx-react";
import React from "react";

const Controls: React.FC = observer(() => {
  const { store } = useWebSocketContext();

  const { selectedCells, balance, betSum, previousBetInfo } = store;

  const repeatDisbled =
    previousBetInfo.repeatEnabled || selectedCells.length || previousBetInfo.betSum > balance;
  const doubleDisabled = !Boolean(selectedCells.length) || balance < betSum;

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
      .catch((err) => console.log("error", err));

  const handleStartGame = async () =>
    await store
      .sendWebSocketMessage(JSON.stringify({ type: "startGame" }))
      .then(() => store.setPreviousBets());

  const handleDoubleBets = async () =>
    await store
      .sendWebSocketMessage(
        JSON.stringify({
          type: "placeBet",
          action: parseCellsToAction(selectedCells),
        })
      )
      .then(() => store.doubleBets())
      .catch((err) => console.log("error", err));

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
      .catch((err) => console.log("error", err));

  return (
    <>
      <button disabled={betSum === 0} onClick={handleStartGame}>
        Start Game
      </button>

      {Boolean(previousBetInfo?.selectedCells?.length) && (
        <button disabled={repeatDisbled} onClick={handleRepeat}>
          Repeat
        </button>
      )}

      {Boolean(selectedCells?.length) && (
        <button disabled={doubleDisabled} onClick={handleDoubleBets}>
          Double
        </button>
      )}

      {Boolean(selectedCells?.length) && <button onClick={handleUndoBets}>Undo</button>}
    </>
  );
});

export default Controls;
