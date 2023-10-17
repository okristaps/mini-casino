import { useWebSocketContext } from "@contexts/context";
import { Phases } from "@types";
import { observer } from "mobx-react";
import Controls from "./controls";

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
      <h1> Balance: {balance}</h1>
      {children}
      <h1> Total Bet: {betSum}</h1>
      {phase === Phases.gameResult && lastPayout !== 0 && (
        <h1 className="feature-win"> Feature win : {lastPayout}</h1>
      )}
      {phase === Phases.betsOpen && lastPayout !== 0 && (
        <h1 className="last-payout"> Last Payout: {lastPayout}</h1>
      )}
      {phase === Phases.betsOpen && <Controls />}
    </div>
  );
};
const BetOptions = ({
  balance,
  betOptions,
  betAmount,
  handleBetSelection,
}: {
  balance: number;
  betOptions: number[];
  betAmount: number;
  handleBetSelection: (bet: number) => void;
}) => {
  return (
    <div className="bet-options-container">
      <div style={{ textAlign: "start" }}> Bet amount: </div>
      <select value={betAmount} onChange={(e) => handleBetSelection(parseInt(e.target.value))}>
        {betOptions.map((bet) => (
          <option value={bet} key={bet} disabled={bet > balance}>
            ${bet}
          </option>
        ))}
      </select>
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

export { Info, BetOptions, ListMessagesComponent };
