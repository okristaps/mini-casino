import { useWebSocketContext } from "@contexts/context";
import React from "react";

interface ColumnSelectorProps {
  columnKeys: string[];
}

const ColumnSelector: React.FC<ColumnSelectorProps> = ({ columnKeys }) => {
  const { store } = useWebSocketContext();
  const { balance } = store;

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

  const handlePlaceBets = async (selectedCol: string) => {
    const betsize = balance / groupedKeys[selectedCol]?.length;
    for (const cellKey of groupedKeys[selectedCol]) {
      await store.sendWebSocketMessage(
        JSON.stringify({
          type: "placeBet",
          action: {
            [cellKey]: betsize,
          },
        })
      );
      store.handleBet(cellKey, 1);
    }
  };

  return (
    <div style={{ flexDirection: "row", flex: 1, width: "100%", justifyContent: "space-around" }}>
      {Object.keys(groupedKeys || []).map((key) => (
        <button
          onClick={() => {
            handlePlaceBets(key);
          }}
          key={key}
        >
          {key}
        </button>
      ))}
    </div>
  );
};

export default ColumnSelector;
