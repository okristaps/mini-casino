const Info = ({
  phase,
  balance,
  lastPayout,
}: {
  phase: string;
  balance: number;
  lastPayout: number;
}) => {
  return (
    <div>
      <h1> Phase: {phase}</h1>
      <h1> Balance: {balance}</h1>
      <h1> lastPayout: {lastPayout}</h1>
    </div>
  );
};

const BetOptions = ({
  balance,
  betOptions,
  selectedBet,
  handleBetSelection,
}: {
  balance: number;
  betOptions: number[];
  selectedBet: number;
  handleBetSelection: (bet: number) => void;
}) => {
  return (
    <div>
      {betOptions.map((bet) => (
        <button
          disabled={bet > balance}
          style={{ backgroundColor: bet === selectedBet ? "green" : "white" }}
          key={bet}
          onClick={() => handleBetSelection(bet)}
        >
          Bet ${bet}
        </button>
      ))}
    </div>
  );
};

export { Info, BetOptions };
