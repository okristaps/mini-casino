import { useWebSocketContext } from "@contexts/context";
import React from "react";

interface ColumnSelectorProps {
  groupedKeys: Record<string, string[]>;
}

const ColumnSelector: React.FC<ColumnSelectorProps> = ({ groupedKeys }) => {
  const { store } = useWebSocketContext();
  const { balance } = store;

  const handlePlaceBets = async (selectedCol: string) => {
    const betsize = balance / groupedKeys[selectedCol]?.length;
    for (const cellKey of groupedKeys[selectedCol]) {
      try {
        await store.sendWebSocketMessage(
          JSON.stringify({
            type: "placeBet",
            action: {
              [cellKey]: 1,
            },
          })
        );
        store.handleBet(cellKey, 1);
      } catch (error) {
        console.error("Error placing bet:", error);
      }
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
