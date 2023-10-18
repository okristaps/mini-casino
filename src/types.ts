export enum MessageTypes {
  settings = "settings",
  startGame = "startGame",
  placeBet = "placeBet",
  game = "game",
  error = "error",
}

export enum Phases {
  betsOpen = "BetsOpen",
  betsClosed = "BetsClosed",
  gameResult = "GameResult",
}

interface BetLimits {
  min: number;
  max: number;
}

interface BetPayload {
  [key: string]: number;
}

export interface Bet {
  cellKey: string;
  bet: number;
}

export interface Multiplier {
  [key: string]: number;
}

export interface Settings {
  betLimits: BetLimits;
  chips: number[];
}

export interface RecievedMessage {
  type: MessageTypes;
  payload?: {
    phase: Phases;
    balance: number;
    multipliers?: BetPayload;
    payout?: number;
    betLimits?: BetLimits;
    chips?: number[];
  };
}

export interface SendMessage {
  type: MessageTypes;
  action?: BetPayload;
}

export interface CheatSettings {
  cheatsEnabled: boolean;
  clickCount: number;
  succCells: string[];
}

export interface PreviousBetInfo {
  repeatEnabled: boolean;
  betSum: number;
  selectedCells: Bet[];
}

export interface LevelSettings {
  selectedLevel: number;
  password: string;
  gameStarted: boolean;
}

export interface Store {
  ws: WebSocket | null;
  balance: number;
  betSum: number;
  multipliers: Multiplier;
  betAmount: number;
  lastPayout: number;
  win: number;
  phase: Phases | string;
  password: string;
  error: string;
  settings: Settings;
  selectedCells: Bet[];
  messages: string[];
  levelSettings: LevelSettings;
  previousBetInfo: PreviousBetInfo;
  cheatSettings: CheatSettings;

  // bet stuff
  setBetAmount(bet: number): void;
  setPreviousBets(): void;
  repeatPreviousBets(): void;
  undoLastBet(): void;
  doubleBets(): void;
  handleBet(cellKey: string, bet: number): void;

  // utility stuff
  doWeirdStuff(): void;
  setError(error: string): void;
  setLevelSettings(password: string, selectedLevel: number, gameStarted: boolean): void;

  // web socket stuff
  connectWebSocket(): Promise<void>;
  sendWebSocketMessage(message: string): Promise<void>;
  addMessage(message: string): void;
  disconnectWebSocket(): void;
  handleWebSocketMessage(event: MessageEvent): void;

  // handle game stuff
  handleGameResult(payload: any): void;
  handleSettingsMessage(payload: any): void;
  handleGameMessage(payload: any): void;
}
