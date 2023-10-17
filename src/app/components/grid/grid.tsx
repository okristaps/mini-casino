import { Phases, Multiplier } from "@types";
import { observer } from "mobx-react";
import React from "react";
import { getBgColor } from "./helpers";
import { Settings } from "@types";

interface GridProps {
  size: number;
  selectedCells: { cellKey: string; bet: number }[];
  onCellClick: (cellKey: string) => void;
  multipliers: Multiplier;
  phase: Phases | string;
  betsDisabled: boolean;
  settings: Settings;
  betAmount: number;
}

const Grid: React.FC<GridProps> = observer(
  ({ size, selectedCells, onCellClick, multipliers, phase, betsDisabled, settings, betAmount }) => {
    const gridItems = [];

    for (let row = 1; row <= size; row++) {
      const rowItems = [];
      for (let col = 1; col <= size; col++) {
        const cellKey = String.fromCharCode(64 + row) + col;
        const selectedCell = selectedCells.find((cell) => cell.cellKey === cellKey);
        const bet = selectedCell?.bet ?? 0;
        const multiplier = multipliers[cellKey];

        // default if bets disabled or disabled if one cell exceeds bet limit
        const disabled = betsDisabled || bet + betAmount > settings.betLimits.max;
        rowItems.push(
          <div
            key={cellKey}
            onClick={() => !disabled && onCellClick(cellKey)}
            className="grid-cell"
            style={{
              backgroundColor: getBgColor(phase, bet, multiplier),
              cursor: !disabled ? "pointer" : "default",
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
