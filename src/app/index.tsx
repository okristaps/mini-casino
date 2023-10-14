import Grid from "@components/grid/grid";
import WebSocketComponent from "@components/webSocketComponent";
import { useState } from "react";

function App() {
  const [selectedCells, setSelectedCells] = useState<{ cellKey: string; bet: number }[]>([]);
  const [selectedBet, setSelectedBet] = useState<number>(0.1);

  const handleCellClick = (cellKey: string) => {
    const cellIndex = selectedCells.findIndex((cell) => cell.cellKey === cellKey);
    const updatedCell = { cellKey, bet: selectedBet };

    cellIndex !== -1 ? (selectedCells[cellIndex] = updatedCell) : selectedCells.push(updatedCell);
    setSelectedCells([...selectedCells]);
  };

  const handleRemoveBet = (cellKey: string) => {
    const updatedCells = selectedCells.filter((cell) => cell.cellKey !== cellKey);
    setSelectedCells(updatedCells);
  };

  const handleBetSelection = (bet: number) => {
    setSelectedBet(bet);
  };

  const betOptions: number[] = [0.1, 0.5, 1, 2, 5, 10, 25, 100, 500];

  return (
    <div>
      <div>
        {betOptions.map((bet) => (
          <button
            style={{ backgroundColor: bet === selectedBet ? "green" : "white" }}
            key={bet}
            onClick={() => handleBetSelection(bet)}
          >
            Bet ${bet}
          </button>
        ))}
      </div>
      <Grid
        onRemoveBet={handleRemoveBet}
        selectedCells={selectedCells}
        size={5}
        onCellClick={handleCellClick}
      />
      <WebSocketComponent />
    </div>
  );
}

export default App;
