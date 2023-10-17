import { useWebSocketContext } from "@contexts/index";
import { observer } from "mobx-react";
import Grid from "./grid/grid";
import { Phases } from "@types";

const Info = ({
  phase,
  balance,
  lastPayout,
  betSum,
}: {
  phase: string;
  balance: number;
  lastPayout: number;
  betSum: number;
}) => {
  return (
    <div>
      <h1> Phase: {phase}</h1>
      <h1> Balance: {balance}</h1>
      {<h1> Total Bet: {betSum}</h1>}
      {phase === Phases.gameResult && lastPayout !== 0 && <h1> Feature win : {lastPayout}</h1>}
      {phase === Phases.betsOpen && lastPayout !== 0 && <h1> lastPayout: {lastPayout}</h1>}
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
    <div>
      {betOptions.map((bet) => (
        <button
          disabled={bet > balance}
          style={{ backgroundColor: bet === betAmount ? "green" : "white" }}
          key={bet}
          onClick={() => handleBetSelection(bet)}
        >
          Bet ${bet}
        </button>
      ))}
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

export { Info, BetOptions, ListMessagesComponent, Grid };