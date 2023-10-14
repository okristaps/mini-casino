import React from "react";

interface GridProps {
  size: number;
  selectedCells: { cellKey: string; bet: number }[];
  onCellClick: (cellKey: string) => void;
  onRemoveBet: (cellKey: string) => void;
}

const Grid: React.FC<GridProps> = ({ size, selectedCells, onCellClick, onRemoveBet }) => {
  const gridItems = [];

  for (let row = 1; row <= size; row++) {
    const rowItems = [];
    for (let col = 1; col <= size; col++) {
      const cellKey = String.fromCharCode(64 + row) + col;
      const selectedCell = selectedCells.find((cell) => cell.cellKey === cellKey);
      const bet = selectedCell ? selectedCell.bet : 0;

      rowItems.push(
        <div key={cellKey} style={{ height: 110, width: 110 }}>
          {bet > 0 && (
            <div className="remove-bet" onClick={() => onRemoveBet(cellKey)}>
              X
            </div>
          )}
          <div
            onClick={() => onCellClick(cellKey)}
            className={`grid-cell ${bet > 0 ? "active" : ""}`}
          >
            <div className="cell-label">{cellKey}</div>
            <div className="cell-bet">Bet: ${bet}</div>
          </div>
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
};

export default Grid;
