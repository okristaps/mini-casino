import { makeAutoObservable } from "mobx";
import { MessageTypes, Phases, Bet, Multiplier, Settings } from "@types";
import { levels } from "@app/constants";
import { findKeyWithLargestValue } from "./helpers";

interface CheatSettings {
  cheatsEnabled: boolean;
  clickCount: number;
  succCells: string[];
}

class WebSocketStore {
  levelSettings = {
    selectedLevel: 1,
    password: "",
    gameStarted: false,
  };

  selectedLevel = levels[1];
  url: string = process.env.REACT_APP_WEB_SOCKET_URL ?? "";
  ws: WebSocket | null = null;
  balance: number = 0;
  betSum: number = 0;
  messages: string[] = [];
  phase: Phases | string = "";
  settings: Settings = { betLimits: { min: 0, max: 0 }, chips: [] };
  selectedCells: Bet[] = [];
  password: string = "";

  multipliers: Multiplier = {};
  betAmount: number = 0;
  lastPayout: number = 0;

  error: string = "";

  previousBetInfo: any = {
    betSum: 0,
    selectedCells: [],
    repeatEnabled: false,
  };

  cheatSettings: CheatSettings = {
    cheatsEnabled: false,
    clickCount: 0,
    succCells: [],
  };

  constructor() {
    makeAutoObservable(this);
  }

  setBetAmount(bet: number): void {
    this.betAmount = bet;
  }

  setPreviousBets() {
    this.previousBetInfo = {
      betSum: this.selectedCells.reduce((acc, cell) => acc + cell.bet, 0),
      selectedCells: this.selectedCells,
      repeatEnabled: false,
    };
  }

  repeatPreviousBets() {
    this.selectedCells = this.previousBetInfo.selectedCells;
    this.betSum = this.previousBetInfo.betSum;
    this.previousBetInfo = {
      ...this.previousBetInfo,
      repeatEnabled: true,
    };
  }

  undoLastBet() {
    const lastBet = this.selectedCells[this.selectedCells.length - 1];
    this.selectedCells = this.selectedCells.filter((cell) => cell.cellKey !== lastBet.cellKey);
    this.balance += lastBet.bet;
    this.betSum -= lastBet.bet;
  }

  doubleBets() {
    this.selectedCells = this.selectedCells.map((cell) => {
      return {
        ...cell,
        bet: cell.bet * 2,
      };
    });
    this.balance = this.balance - this.betSum;
    this.betSum = this.betSum * 2;
  }

  handleBet(cellKey: string, bet: number) {
    const cellIndex = this.selectedCells.findIndex((cell) => cell.cellKey === cellKey);
    this.balance -= bet;
    this.betSum += bet;
    if (cellIndex !== -1) {
      this.selectedCells[cellIndex].bet += bet;
    } else {
      this.selectedCells.push({ cellKey, bet });
    }
  }

  doWeirdStuff() {
    this.cheatSettings.clickCount = this.cheatSettings.clickCount + 1;
    if (this.cheatSettings?.clickCount === 10) this.cheatSettings.cheatsEnabled = true;
  }

  setError(error: string) {
    this.error = error;
  }

  setLevelSettings(password: string, selectedLevel: number, gameStarted: boolean) {
    this.levelSettings = {
      selectedLevel,
      password,
      gameStarted,
    };
  }

  async connectWebSocket() {
    return new Promise<void>((resolve, reject) => {
      try {
        this.ws = new WebSocket(
          this.url +
            `/?field=${levels[this.levelSettings.selectedLevel].field}&password=${
              this.levelSettings.password
            }}`
        );
        this.ws.onopen = () => {
          console.log("WebSocket connected");
          resolve();
        };
        this.ws.onmessage = (event) => {
          const jsonEvent = JSON.parse(event.data);
          const { type, payload } = jsonEvent;

          if (payload.phase === Phases.betsOpen) {
            this.selectedCells = [];
            this.betSum = 0;
          }
          if (payload.phase === Phases.gameResult) {
            this.lastPayout = payload.payout > 0 ? payload.payout : this.lastPayout;
            this.multipliers = payload.multipliers;
            const test = findKeyWithLargestValue(payload.multipliers);
            this.cheatSettings.succCells = [...this.cheatSettings.succCells, `${test}`];
            this.setPreviousBets();
          }

          if (type === MessageTypes.settings) {
            this.settings = {
              betLimits: payload.betLimits,
              chips: payload.chips,
            };
            this.betAmount = payload.chips[0] ?? 0.1;
          }

          if (type === MessageTypes.game) {
            this.phase = payload.phase;
            this.balance = payload.balance;

            if (payload.password && payload.password !== this.levelSettings.password) {
              this.levelSettings = {
                gameStarted: true,
                password: payload.password,
                selectedLevel: this.levelSettings.selectedLevel + 1,
              };
            }
          }
          this.addMessage(event.data);
        };
        this.ws.onclose = () => {
          console.log("WebSocket disconnected");
          this.setError("WebSocket disconnected");
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  async sendWebSocketMessage(message: string) {
    return new Promise<void>((resolve, reject) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        try {
          this.ws.send(message);
          resolve();
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error("WebSocket is not open"));
      }
    });
  }

  addMessage(message: string) {
    this.messages.push(message);
  }

  disconnectWebSocket() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

const store = new WebSocketStore();

export default store;
