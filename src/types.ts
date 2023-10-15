type BetLimits = {
  min: number;
  max: number;
};

type BetPayload = {
  [key: string]: number;
};

export type bet = {
  cellKey: string;
  bet: number;
};

export type multiplier = {
  [key: string]: number;
};

export interface settings {
  betLimits: BetLimits;
  chips: number[];
}

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
