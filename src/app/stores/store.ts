import { makeAutoObservable } from "mobx";
import { MessageTypes, Phases, Bet, Multiplier, Settings } from "@types";

class WebSocketStore {
  url: string = process.env.REACT_APP_WEB_SOCKET_URL ?? "";
  ws: WebSocket | null = null;
  balance: number = 0;
  betSum: number = 0;
  messages: string[] = [];
  phase: Phases | string = "";
  settings: Settings = { betLimits: { min: 0, max: 0 }, chips: [] };
  selectedCells: Bet[] = [];
  previousCells: Bet[] = [];
  multipliers: Multiplier = {};
  betAmount: number = 0.1;
  lastPayout: number = 0;

  previousBetInfo: any = {
    betSum: 0,
    selectedCells: [],
    repeatEnabled: false,
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

  async connectWebSocket() {
    return new Promise<void>((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);
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
          }
          this.addMessage(event.data);
        };
        this.ws.onclose = () => {
          console.log("WebSocket disconnected");
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  async sendWebSocketMessage(message: string) {
    return new Promise<void>((resolve, reject) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        console.log("message", message);
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
