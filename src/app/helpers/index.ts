import { Bet } from "@types";

const parseCellsToAction = (selectedCells: Bet[]) => {
  const action: { [key: string]: number } = {};

  for (const item of selectedCells) {
    if (item?.cellKey) {
      action[item.cellKey] = item.bet;
    }
  }

  return action;
};

export { parseCellsToAction };
