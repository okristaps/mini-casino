import { makeAutoObservable, runInAction } from "mobx";
import {
  MessageTypes,
  Phases,
  Bet,
  Multiplier,
  Settings,
  CheatSettings,
  PreviousBetInfo,
} from "@types";
import { levels } from "@app/constants";
import { findKeyWithLargestValue } from "./helpers";

const url: string = process.env.REACT_APP_WEB_SOCKET_URL ?? "";
const disconnected = "WebSocket disconnected";
class WebSocketStore {
  ws: WebSocket | null = null;

  balance: number = 0;
  betSum: number = 0;
  multipliers: Multiplier = {};
  betAmount: number = 0;
  lastPayout: number = 0;
  win: number = 0;
  phase: Phases | string = "";
  password: string = "";
  error: string = "";

  settings: Settings = { betLimits: { min: 0, max: 0 }, chips: [] };
  selectedCells: Bet[] = [];
  messages: string[] = [];

  levelSettings = {
    selectedLevel: 1,
    password: "",
    gameStarted: false,
  };

  previousBetInfo: PreviousBetInfo = {
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

  // bet stuff

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

  // utility stuff

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

  // websocket stuff

  async connectWebSocket() {
    return new Promise<void>((resolve, reject) => {
      try {
        this.ws = new WebSocket(
          url +
            `/?field=${levels[this.levelSettings.selectedLevel].field}&password=${
              this.levelSettings.password
            }}`
        );
        this.ws.onopen = () => {
          resolve();
        };
        this.ws.onmessage = (event) => {
          runInAction(() => this.handleWebSocketMessage(event));
        };
        this.ws.onclose = () => {
          this.setError(disconnected);
        };
      } catch (error: any) {
        this.error = error.toString();
        reject(error);
      }
    });
  }

  async sendWebSocketMessage(message: string) {
    return new Promise<void>((resolve, reject) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        try {
          this.ws.send(message);
          return resolve();
        } catch (error: any) {
          this.error = error.toString();
        }
      } else {
        this.error = disconnected;
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

  handleWebSocketMessage(event: MessageEvent) {
    // for some reason the json doesnt work, and cant parse error to json either
    if (event.data.toString().includes("error")) this.error = event.data.toString();
    else {
      const jsonEvent = JSON.parse(event.data);
      const { type, payload } = jsonEvent;

      if (payload.phase === Phases.betsOpen) {
        this.selectedCells = [];
        this.betSum = 0;
        this.win = 0;
      }

      if (payload.phase === Phases.gameResult) {
        this.handleGameResult(payload);
      }

      if (type === MessageTypes.settings) {
        this.handleSettingsMessage(payload);
      }

      if (type === MessageTypes.game) {
        this.handleGameMessage(payload);
      }
      this.addMessage(event.data);
    }
  }

  // result handle stuff

  handleGameResult(payload: any) {
    this.lastPayout = payload.payout > 0 ? payload.payout : this.lastPayout;
    this.win = payload.payout;
    this.multipliers = payload.multipliers;
    const test = findKeyWithLargestValue(payload.multipliers);
    this.cheatSettings.succCells = [...this.cheatSettings.succCells, `${test}`];
    this.setPreviousBets();
  }

  handleSettingsMessage(payload: any) {
    this.settings = {
      betLimits: payload.betLimits,
      chips: payload.chips,
    };
    this.betAmount = payload.chips[0] ?? 0.1;
  }

  handleGameMessage(payload: any) {
    this.phase = payload.phase;
    this.balance = payload.balance;

    if (payload.password && payload.password !== this.levelSettings.password) {
      this.password = payload.password;
    }
  }
}

const store = new WebSocketStore();

export default store;
