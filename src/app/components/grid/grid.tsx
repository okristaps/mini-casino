import { Phases, multiplier } from "@types";
import { observer } from "mobx-react";
import React from "react";
import { getBgColor } from "./helpers";

interface GridProps {
  size: number;
  selectedCells: { cellKey: string; bet: number }[];
  onCellClick: (cellKey: string) => void;
  multipliers: multiplier;
  phase: Phases | string;
  betsDisabled: boolean;
}

const Grid: React.FC<GridProps> = observer(
  ({ size, selectedCells, onCellClick, multipliers, phase, betsDisabled }) => {
    const gridItems = [];

    for (let row = 1; row <= size; row++) {
      const rowItems = [];
      for (let col = 1; col <= size; col++) {
        const cellKey = String.fromCharCode(64 + row) + col;
        const selectedCell = selectedCells.find((cell) => cell.cellKey === cellKey);
        const bet = selectedCell?.bet ?? 0;
        const multiplier = multipliers[cellKey];

        rowItems.push(
          <div
            key={cellKey}
            onClick={() => !betsDisabled && onCellClick(cellKey)}
            className="grid-cell"
            style={{
              backgroundColor: getBgColor(phase, bet, multiplier),
              cursor: !betsDisabled ? "pointer" : "default",
            }}
          >
            <div className="cell-label">{cellKey}</div>
            <div className="cell-bet">Bet: ${bet}</div>
            {multiplier && phase === Phases.gameResult && (
              <div className="cell-multiplier">x{multiplier}</div>
            )}
          </div>
        );
      }
      gridItems.push(
        <div key={row} className="grid-row">
          {rowItems}
        </div>
      );
    }

    return <div className="grid-container">{gridItems}</div>;
  }
);

export default Grid;
