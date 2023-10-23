import { Store } from "@types";

export const createMockStore = () => {
  const defaultStore: Store = {
    ws: null,
    balance: 1000,
    betSum: 0,
    multipliers: {
      red: 36,
      black: 36,
      green: 2,
    },
    betAmount: 10,
    lastPayout: 0,
    win: 0,
    phase: "betsOpen",
    password: "mySecretPassword",
    error: "",
    settings: {
      betLimits: { min: 1, max: 100 },
      chips: [1, 5, 10, 25, 50, 100],
    },
    selectedCells: [],
    messages: [],
    levelSettings: {
      selectedLevel: 1,
      password: "mySecretPassword",
      gameStarted: true,
    },
    previousBetInfo: {
      repeatEnabled: false,
      betSum: 0,
      selectedCells: [],
    },
    cheatSettings: {
      cheatsEnabled: false,
      clickCount: 0,
      succCells: [],
    },
    setBetAmount: jest.fn(),
    setPreviousBets: jest.fn(),
    repeatPreviousBets: jest.fn(),
    undoLastBet: jest.fn(),
    doubleBets: jest.fn(),
    doWeirdStuff: jest.fn(),
    setError: jest.fn(),
    setLevelSettings: jest.fn(),
    connectWebSocket: jest.fn(),
    sendWebSocketMessage: jest.fn(),
    addMessage: jest.fn(),
    disconnectWebSocket: jest.fn(),
    handleWebSocketMessage: jest.fn(),
    handleGameResult: jest.fn(),
    handleSettingsMessage: jest.fn(),
    handleGameMessage: jest.fn(),
    handleBet: jest.fn(),
  };

  return { ...defaultStore };
};
