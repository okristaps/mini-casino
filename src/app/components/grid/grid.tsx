import React from "react";

interface GridProps {
  size: number;
}

const Grid: React.FC<GridProps> = ({ size }) => {
  const gridItems = [];

  for (let row = 1; row <= size; row++) {
    const rowItems = [];
    for (let col = 1; col <= size; col++) {
      const cellLabel = String.fromCharCode(64 + row) + col;
      rowItems.push(
        <div key={cellLabel} className="grid-cell">
          {cellLabel}
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
