type BetLimits = {
  min: number;
  max: number;
};

type BetPayload = {
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

export enum BetOptions {
  Bet0_1 = 0.1,
  Bet0_5 = 0.5,
  Bet1 = 1,
  Bet2 = 2,
  Bet5 = 5,
  Bet10 = 10,
  Bet25 = 25,
  Bet100 = 100,
  Bet500 = 500,
}
