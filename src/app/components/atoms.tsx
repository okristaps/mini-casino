import { parseCellsToAction } from "@app/helpers";
import { useWebSocketContext } from "@contexts/context";
import { Phases } from "@types";
import { observer } from "mobx-react";

const Info = ({
  phase,
  balance,
  lastPayout,
  betSum,
  children,
}: {
  phase: string;
  balance: number;
  lastPayout: number;
  betSum: number;
  children?: React.ReactNode;
}) => {
  return (
    <div className="info-container">
      <div className="title-container">
        <div className="column">
          <span>Balance</span>
          <span>{balance.toFixed(1)}</span>
        </div>
        <div className="column">
          <span>Total Bet</span>
          <span>{betSum.toFixed(1)}</span>
        </div>
      </div>
      {children}

      <div style={{ marginTop: 20 }}>
        {lastPayout !== 0 && <h1 className="last-payout"> Last Payout: {lastPayout.toFixed(1)}</h1>}
        {lastPayout !== 0 && (
          <h1 className="feature-win" style={{ marginTop: 10, marginBottom: 10 }}>
            Feature win : {lastPayout.toFixed(1)}
          </h1>
        )}
      </div>
    </div>
  );
};
const BetOptions = () => {
  const { store } = useWebSocketContext();
  const { selectedCells, balance, betSum, betAmount, settings } = store;
  const doubleDisabled = !selectedCells.length || balance < betSum;

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

  return (
    <div className="bet-options-container">
      <select value={betAmount} onChange={(e) => store.setBetAmount(parseInt(e.target.value))}>
        {settings.chips.map((bet) => (
          <option value={bet} key={bet} disabled={bet > balance}>
            ${bet}
          </option>
        ))}
      </select>
      <button
        onClick={handleDoubleBets}
        className="custom-button"
        disabled={doubleDisabled}
        style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, boxShadow: "none" }}
      >
        <span>Dobule</span>
      </button>
    </div>
  );
};

const Header = ({ phase }: { phase: string }) => {
  return (
    <div style={{ textAlign: "center" }}>
      <h1 style={{ color: "white" }}> {phase} </h1>
    </div>
  );
};

const ListMessagesComponent = observer(() => {
  const { store } = useWebSocketContext();

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

export { BetOptions, Info, ListMessagesComponent, Header };
