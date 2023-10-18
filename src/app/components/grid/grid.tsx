import { Phases, Multiplier } from "@types";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { getBgColor } from "./helpers";
import { Settings } from "@types";

import ColumnSelector from "@components/cheats/colcheats";
import { useWebSocketContext } from "@contexts/context";

interface GridProps {
  size: number;
  selectedCells: { cellKey: string; bet: number }[];
  onCellClick: (cellKey: string) => void;
  multipliers: Multiplier;
  phase: Phases | string;
  betsDisabled: boolean;
  settings: Settings;
  betAmount: number;
  cheatsEnabled?: boolean;
}

const Grid: React.FC<GridProps> = observer(
  ({
    size,
    selectedCells,
    onCellClick,
    multipliers,
    phase,
    betsDisabled,
    settings,
    betAmount,
    cheatsEnabled = true,
  }) => {
    const { store } = useWebSocketContext();
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
            {/* {bet > 0 && <div className="cell-bet">${bet.toFixed(1)}</div>} */}
            {multiplier > 0 && phase === Phases.gameResult && (
              <div className="cell-multiplier">x{multiplier.toFixed(1)}</div>
            )}
            {cheatsEnabled && store.cheatSettings.succCells.includes(cellKey) && (
              <div style={{ flex: 1, background: "black" }}> xxxxxx</div>
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

    const columnKeys = gridItems?.flatMap(
      (obj) => obj?.props?.children?.map((child: any) => child.key) || []
    );

    const groupedKeys: Record<string, string[]> = (columnKeys || [])?.reduce(
      (groups: Record<string, string[]>, key: string) => {
        const initialLetter = key.charAt(0);

        if (!groups[initialLetter]) {
          groups[initialLetter] = [];
        }

        groups[initialLetter].push(key);

        return groups;
      },
      {}
    );

    return (
      <div style={{ flexDirection: "column" }}>
        {cheatsEnabled && <ColumnSelector groupedKeys={groupedKeys} />}
        <div className="grid-container">{gridItems}</div>
      </div>
    );
  }
);

export default Grid;
